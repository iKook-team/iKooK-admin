import { FaSquareFacebook, FaSquareInstagram, FaSquareXTwitter } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import logo from '../assets/icons/logo.svg';
import { createRef } from 'react';

export const FooterRef = createRef<HTMLElement>();

export default function Footer() {
  return (
    <footer ref={FooterRef} className="bg-neutral-900 text-white">
      <div className="container mx-auto px-small py-8">
        <div className="grid md:grid-cols-3 grid-cols-1 gap-8">
          <div>
            <Link to="/" className="footer-title">
              <img src={logo} alt="iKooK Admin" className="w-[3.5rem]" />
            </Link>
            <p className="mt-2">
              iKooK Admin is a platform that connects patients with healthcare providers
            </p>
          </div>
          <nav className="flex flex-col">
            <h6 className="footer-title">Quick Links</h6>
            {/*<a className="link link-hover" href="/about-us">*/}
            {/*  About Us*/}
            {/*</a>*/}
            {/*<a className="link link-hover" href="/contact-us">*/}
            {/*  Contact Us*/}
            {/*</a>*/}
            <a className="link link-hover" href="/info/how-to-play">
              How to Play
            </a>
            <a className="link link-hover" href="/info/responsible-gaming">
              Responsible Gaming
            </a>
          </nav>
          <nav>
            <h2 className="footer-title">Stay in touch</h2>
            <p>Get connected with us on social networks!</p>
            <ul className="mt-2 flex flex-row gap-3">
              <a className="link link-hover" href="https://facebook.com">
                <FaSquareFacebook />
              </a>

              <a className="link link-hover" href="https://twitter.com">
                <FaSquareXTwitter />
              </a>

              <a className="link link-hover" href="https://instagram.com">
                <FaSquareInstagram />
              </a>
            </ul>
          </nav>
        </div>
        <div className="h-[1px] w-full bg-white my-small"></div>
        <p className="mb-1 text-center">
          &copy; {new Date().getFullYear()} iKooK Admin. All rights reserved. Must be 18 or older to
          play.
        </p>
        <div className="flex flex-row items-center justify-center">
          <Link className="link font-semibold" to="/info/privacy-policy">
            Privacy Policy
          </Link>
          <div className="mx-2">|</div>
          <Link className="link font-semibold" to="/info/terms">
            Terms of Use
          </Link>
        </div>
      </div>
    </footer>
  );
}
