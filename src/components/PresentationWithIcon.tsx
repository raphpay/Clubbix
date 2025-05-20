type PresentationWithIconProps = {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
};

const PresentationWithIcon = ({
  id,
  icon,
  title,
  description,
}: PresentationWithIconProps) => {
  return (
    <div key={id} className=" mb-6 flex items-center flex-col gap-6">
      <div className="bg-blue-200 w-[50px] h-[50px] rounded-full p-2 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default PresentationWithIcon;
