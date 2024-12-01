import { dotWave, lineWobble, mirage, tailspin } from 'ldrs';
import LinearProgressWithLabel from '../ProgressBar';

const LoadingScreen = () => {
  dotWave.register();
  return (
    <div className="h-dvh flex justify-center items-center">
      <l-dot-wave size={100} speed={1} color={'green'}></l-dot-wave>
    </div>
  );
};

export const LoadingDataScreen = () => {
  lineWobble.register();
  return (
    <div className={`h-full w-full flex justify-center items-center`}>
      <l-line-wobble
        size="100"
        stroke="5"
        bg-opacity="0.1"
        speed="1.75"
        color="black"
      ></l-line-wobble>
    </div>
  );
};

export const LoadingWithProgress = ({ value }: { value: number }) => {
  mirage.register();
  return (
    <div className="h-dvh flex justify-center items-center">
      <l-mirage size={100} speed={1} color={'green'}></l-mirage>
      <LinearProgressWithLabel value={value} />
    </div>
  );
};

export const LoadingContentScreen = () => {
  mirage.register();
  return <l-mirage size={100} speed={2.5} color={'green'}></l-mirage>;
};

export const LoadingButton = () => {
  tailspin.register();
  return <l-tailspin size={20} speed={1} color={'white'}></l-tailspin>;
};

export default LoadingScreen;
