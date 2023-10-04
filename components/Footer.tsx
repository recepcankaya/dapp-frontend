import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full p-4">
      <div className="container mx-auto text-center">
        <div className="flex justify-center space-x-4 text-purpleColor">
          <Link
            href="https://twitter.com/LadderitApp"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground">
            Twitter
          </Link>
          <Link
            href="https://www.linkedin.com/company/ladder-it/about/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground">
            Linkedin
          </Link>
          <Link
            href="https://www.instagram.com/ladderitapp/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground">
            Instagram
          </Link>
        </div>
        <p className="text-sm pt-3">
          &copy; {new Date().getFullYear()} Ladder It
        </p>
      </div>
    </footer>
  );
}
