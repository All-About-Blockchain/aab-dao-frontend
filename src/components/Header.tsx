import Link from 'next/link';
import Image from 'next/image';
// WalletConnect removed from UI per request

const Header = () => {
  return (
    <div className="z-50 flex h-[60px] w-full items-center justify-between p-6 md:p-12">
      <div className="flex items-center gap-6">
        <Link href="/">
          <div className="w-[90px]">
            <Image
              src="/AAB-logo.svg"
              width={60}
              height={20}
              alt="All About Blockchain Logo"
            />
          </div>
        </Link>
        <Link className="hidden md:block" href="/">
          <span className="text-lg font-bold md:text-xl">
            All About Blockchain
          </span>
        </Link>
      </div>
      <div className="flex items-center gap-8" />
    </div>
  );
};

export default Header;
