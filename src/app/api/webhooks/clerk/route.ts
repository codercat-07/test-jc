import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { errorResponse, successResponse } from '@/lib/api';

export async function POST(req: Request) {
  try {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
      throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
    }

    const headerPayload = await headers();
    const svix_id = headerPayload.get('svix-id');
    const svix_timestamp = headerPayload.get('svix-timestamp');
    const svix_signature = headerPayload.get('svix-signature');

    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new Response('Error occured -- no svix headers', { status: 400 });
    }

    const payload = await req.text();
    const body = payload;

    const wh = new Webhook(WEBHOOK_SECRET);
    let evt: WebhookEvent;

    try {
      evt = wh.verify(body, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      }) as WebhookEvent;
    } catch (err) {
      console.error('Error verifying webhook:', err);
      return new Response('Error occured', { status: 400 });
    }

    const eventType = evt.type;

    if (eventType === 'user.created') {
      const { id, email_addresses, phone_numbers, first_name, last_name, image_url } = evt.data;
      const email = email_addresses[0]?.email_address;
      const phone = phone_numbers?.[0]?.phone_number;
      const name = [first_name, last_name].filter(Boolean).join(' ') || 'New User';

      await prisma.user.create({
        data: {
          clerkId: id,
          email,
          phone,
          name,
          avatar: image_url,
        },
      });

      return successResponse({ message: 'User created' });
    }

    if (eventType === 'user.updated') {
      const { id, email_addresses, phone_numbers, first_name, last_name, image_url } = evt.data;
      const email = email_addresses[0]?.email_address;
      const phone = phone_numbers?.[0]?.phone_number;
      const name = [first_name, last_name].filter(Boolean).join(' ') || 'Updated User';

      await prisma.user.update({
        where: { clerkId: id },
        data: {
          email,
          phone,
          name,
          avatar: image_url,
        },
      });
      return successResponse({ message: 'User updated' });
    }

    if (eventType === 'user.deleted') {
      const { id } = evt.data;
      if (id) {
        await prisma.user.update({
          where: { clerkId: id },
          data: {
            isActive: false,
          },
        });
      }
      return successResponse({ message: 'User deactivated' });
    }

    return successResponse({ message: 'Event ignored' });
  } catch (error) {
    return errorResponse(error);
  }
}
