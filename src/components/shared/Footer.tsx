import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background py-12">
      <div className="container px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold">BD-LMS</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The ultimate learning platform for BCS and government job seekers in Bangladesh. 
              Comprehensive resources, live exams, and expert lectures.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/mcq" className="hover:text-primary transition-colors">MCQ Bank</Link></li>
              <li><Link href="/lecture" className="hover:text-primary transition-colors">Lecture Notes</Link></li>
              <li><Link href="/exam" className="hover:text-primary transition-colors">Exam Hall</Link></li>
              <li><Link href="/written-exam" className="hover:text-primary transition-colors">Written Preparation</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              {/* Icons could go here */}
              <span className="text-sm text-muted-foreground">Facebook · YouTube · Join Group</span>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} BD-LMS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
