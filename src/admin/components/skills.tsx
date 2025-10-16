
const Skills: React.FC = () => {



  return (
    //bg-white rounded-xl shadow-lg
    <div className="w-full max-w-7xl mx-auto p-6 sm:p-10">
      <div className="flex flex-col mb-6 sm:mb-0">
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          My Skills
        </h2>
      </div>

      <div className="flex justify-end items-center">
        <button 
          type="submit"
          className=" bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 sm:mt-2"
        >
          +Add New Skills
        </button>
      </div>

    </div>
  );
};

export default Skills;
