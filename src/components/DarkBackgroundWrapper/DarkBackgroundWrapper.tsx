interface Props {
  children: JSX.Element;
  opacity?: number;
  onClose?: () => void;
}

const DarkBackgroundWrapper = ({ children, opacity, onClose }: Props) => {
  const opacityToUse = opacity
    ? `rgba(0, 0, 0, ${opacity})`
    : 'rgba(0, 0, 0, 0.75)';

  return (
    <div
      style={{ backgroundColor: opacityToUse }}
      className="fixed inset-0 z-[100000] flex items-center justify-center p-3 sm:p-4 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) {
          onClose();
        }
      }}
    >
      {children}
    </div>
  );
};

export default DarkBackgroundWrapper;