import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full px-14 py-4 bg-gray-900 text-white flex flex-col sm:flex-row justify-between">
      <div className="text-right text-sm capitalize">
       <Link className=" underline" href="https://upforcetech.com/" target="_blank">Upforce Tech</Link> Assesment
      </div>
      <div className="text-right text-sm capitalize">
       all rights reserved 2025 © deep sutariya
      </div>
    </footer>
  );
}