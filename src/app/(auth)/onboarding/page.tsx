import { redirect } from 'next/navigation';
import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export default async function OnboardingPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // Check if they already onboarded
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { name: true, isActive: true },
  });

  if (dbUser && dbUser.name && dbUser.name !== 'New User' && dbUser.isActive) {
    redirect('/');
  }

  const clerkUser = await currentUser();
  const defaultName = clerkUser ? `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() : '';

  async function completeOnboarding(formData: FormData) {
    'use server';

    const { userId } = await auth();
    if (!userId) redirect('/sign-in');

    const name = formData.get('name') as string;
    
    if (!name || name.trim().length < 2) {
      throw new Error('Name must be at least 2 characters long');
    }

    await prisma.user.update({
      where: { clerkId: userId },
      data: { name: name.trim() },
    });

    redirect('/');
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-background">
      <Card className="max-w-md w-full glass-card border-none card-shadow">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold">Complete Your Profile</CardTitle>
          <CardDescription>
            Just one last step before you start learning. How should we call you?
          </CardDescription>
        </CardHeader>
        <form action={completeOnboarding}>
          <CardContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Preferred Display Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={defaultName}
                placeholder="e.g. John Doe"
                required
                minLength={2}
                className="bg-surface/50"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full font-medium" size="lg">
              Finish Setup
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
