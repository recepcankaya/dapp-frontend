import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full p-4">
      <div className="container mx-auto text-center">
        <div className="flex justify-center space-x-4 text-purpleColor hover:text-btnNotifyColor">
          <Link
            href="https://twitter.com/your-twitter"
            target="_blank"
            rel="noopener noreferrer">
            Twitter
          </Link>
          <Link
            href="https://www.facebook.com/your-facebook"
            target="_blank"
            rel="noopener noreferrer">
            Linkedin
          </Link>
          <Link
            href="https://www.instagram.com/your-instagram"
            target="_blank"
            rel="noopener noreferrer">
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
