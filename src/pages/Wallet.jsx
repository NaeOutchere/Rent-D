import React, { useState } from "react";

const Wallet = () => {
  const [cards, setCards] = useState([
    {
      id: 1,
      type: "Visa",
      last4: "4242",
      expiry: "12/24",
      isDefault: true,
    },
  ]);

  const [showAddCard, setShowAddCard] = useState(false);
  const [newCard, setNewCard] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });

  const handleAddCard = (e) => {
    e.preventDefault();
    // Handle card addition logic here
    const addedCard = {
      id: cards.length + 1,
      type: "Visa", // You can determine this from the card number
      last4: newCard.number.slice(-4),
      expiry: newCard.expiry,
      isDefault: cards.length === 0,
    };

    setCards([...cards, addedCard]);
    setNewCard({ number: "", name: "", expiry: "", cvv: "" });
    setShowAddCard(false);
  };

  const setDefaultCard = (cardId) => {
    setCards(
      cards.map((card) => ({
        ...card,
        isDefault: card.id === cardId,
      }))
    );
  };

  const removeCard = (cardId) => {
    setCards(cards.filter((card) => card.id !== cardId));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Payment Methods
          </h1>
          <button
            onClick={() => setShowAddCard(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add New Card
          </button>
        </div>

        {/* Current Cards */}
        <div className="bg-white dark:bg-secondary-dark-bg rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Your Cards
          </h2>
          {cards.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">
              No cards added yet.
            </p>
          ) : (
            <div className="space-y-4">
              {cards.map((card) => (
                <div
                  key={card.id}
                  className="flex justify-between items-center p-4 border border-gray-200 dark:border-gray-600 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-8 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center">
                      {card.type}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {card.type} •••• {card.last4}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Expires {card.expiry}
                      </p>
                    </div>
                    {card.isDefault && (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    {!card.isDefault && (
                      <>
                        <button
                          onClick={() => setDefaultCard(card.id)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Set Default
                        </button>
                        <button
                          onClick={() => removeCard(card.id)}
                          className="text-red-600 hover:text-red-800 ml-4"
                        >
                          Remove
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Card Form */}
        {showAddCard && (
          <div className="bg-white dark:bg-secondary-dark-bg rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Add New Card
            </h2>
            <form onSubmit={handleAddCard}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={newCard.number}
                    onChange={(e) =>
                      setNewCard({ ...newCard, number: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={newCard.name}
                    onChange={(e) =>
                      setNewCard({ ...newCard, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={newCard.expiry}
                    onChange={(e) =>
                      setNewCard({ ...newCard, expiry: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    value={newCard.cvv}
                    onChange={(e) =>
                      setNewCard({ ...newCard, cvv: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddCard(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Card
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallet;
