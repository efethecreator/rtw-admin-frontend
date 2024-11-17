// managequestion 

import React from 'react';

const QuestionPackage = ({ pkg, expandedPackages, togglePackage, openEditModal, deleteQuestion, deleteQuestionPackage }) => {
  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex justify-between items-center bg-white">
        <h3 className="text-xl text-white cursor-pointer bg-white" onClick={() => togglePackage(pkg.id)}>
          {pkg.title}
        </h3>
        {!expandedPackages.includes(pkg.id) && (
          <button
            onClick={() => deleteQuestionPackage(pkg.id)}
            className="bg-red-500 text-white rounded p-1 ml-2"
          >
            Delete
          </button>
        )}
      </div>

      {expandedPackages.includes(pkg.id) && (
        <div className="mt-4 space-y-2">
          <h4 className="text-lg text-white">Sorular</h4>
          <ul className="list-disc list-inside mb-2">
            {pkg.questions.map((question) => (
              <li key={question.id} className="text-gray-300 flex justify-between">
                <span>{question.question} ({question.time} dakika)</span>
                <div>
                  <button
                    onClick={() => openEditModal(pkg, question)}
                    className="bg-yellow-500 text-white rounded p-1 ml-2"
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => deleteQuestion(pkg.id, question.id)}
                    className="bg-red-500 text-white rounded p-1 ml-2"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <button onClick={() => openEditModal(pkg)} className="bg-green-500 text-white rounded p-2">
            Soru Ekle
          </button>
        </div>
      )}
    </div>
  );
};

export default QuestionPackage;
