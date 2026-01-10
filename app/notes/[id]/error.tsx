'use clitnt';

import { error } from 'console';

type Props = {
  error: Error;
  reset: () => void;
};

const Error = ({ error, reset }: Props) => {
  return (
    <div>
      <p>Could not fetch note detalis. {error.message}</p>

      <button onClick={reset}> Try again </button>
    </div>
  );
};

export default Error;
