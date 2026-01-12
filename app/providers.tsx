'use client';

import TanStackProvider from '@/components/TanStackProvider/TanStackProvider';

type Props = {
  children: React.ReactNode;
};

const Providers = ({ children }: Props) => {
  return <TanStackProvider>{children}</TanStackProvider>;
};

export default Providers;
