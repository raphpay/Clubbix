const Card = ({ title, value }: { title: string; value: string }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow text-center">
      <h3 className="text-lg font-medium text-gray-700">{title}</h3>
      <p className="text-3xl font-bold text-blue-600 mt-2">{value}</p>
    </div>
  );
};

export default Card;
