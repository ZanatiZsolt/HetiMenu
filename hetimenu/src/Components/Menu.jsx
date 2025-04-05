import React, { useState, useEffect } from "react";
import config from '../config';

const Menu = () => {
  const [foods, setFoods] = useState([]);
  const [newFood, setNewFood] = useState({ name: "", weekend: false });
  const [weeklyMenu, setWeeklyMenu] = useState([]);
  const [motherName, setMotherName] = useState("Anya");
  const [error, setError] = useState(null);

  // Betöltjük az étkezéseket a backendről
  useEffect(() => {
    fetch(`${config.apiUrl}/foods`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setFoods(data);
        // Generate initial menu when foods are loaded
        setWeeklyMenu(generateWeeklyMenu(data));
        setError(null);
      })
      .catch((error) => {
        console.error('Error fetching foods:', error);
        setError('Failed to load foods. Please try again later.');
      });
  }, []);

  // Heti menü generálása (minden napra egy étel, hétvégén csak hétvégi étel)
  const generateWeeklyMenu = (foodsData = foods) => {
    if (!foodsData || foodsData.length === 0) return []; // Ha a foods üres vagy undefined, üres tömböt adunk vissza

    // Hétköznapi ételek (hétfőtől péntekig)
    const weekdayFoods = foodsData.filter(food => food && !food.weekend); // Ellenőrizzük, hogy a food nem undefined

    // Hétvégi ételek
    const weekendFoods = foodsData.filter(food => food && food.weekend); // Ellenőrizzük, hogy a food nem undefined

    // Véletlenszerűen keverjük meg az ételeket
    const shuffleArray = (array) => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };

    const shuffledWeekdayFoods = shuffleArray(weekdayFoods);
    const shuffledWeekendFoods = shuffleArray(weekendFoods);

    let menu = [];

    // Heti menü készítése (hétköznapi ételek minden napra)
    for (let i = 0; i < 5 && i < shuffledWeekdayFoods.length; i++) {
      menu.push(shuffledWeekdayFoods[i]);
    }

    while (menu.length < 5) {
      menu.push({ name: "Nincs hétköznapi étel" });
    }

    // Hétvégén csak hétvégi ételt adunk
    if (shuffledWeekendFoods.length >= 2) {
      menu.push(shuffledWeekendFoods[0]); // Szombat
      menu.push(shuffledWeekendFoods[1]); // Vasárnap
    } else if (shuffledWeekendFoods.length === 1) {
      menu.push(shuffledWeekendFoods[0]); // Szombat
      menu.push({ name: "Nincs hétvégi étel" }); // Vasárnap
    } else {
      // Ha nincs hétvégi étel, akkor üres napokat adunk
      menu.push({ name: "Nincs hétvégi étel" }); // Szombat
      menu.push({ name: "Nincs hétvégi étel" }); // Vasárnap
    }

    return menu.slice(0, 7); // Biztosítjuk, hogy maximum 7 ételt jelenítünk meg
  };

  // Function to regenerate the menu
  const handleRegenerateMenu = () => {
    setWeeklyMenu(generateWeeklyMenu());
  };

  const handleAddFood = () => {
    if (!newFood.name.trim()) return;

    const foodExists = foods.some(
      (food) => food.name.toLowerCase() === newFood.name.toLowerCase()
    );
    if (foodExists) return;

    fetch(`${config.apiUrl}/addFood`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newFood),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((updatedFoods) => {
        setFoods(updatedFoods);
        setNewFood({ name: "", weekend: false });
        setError(null);
      })
      .catch((error) => {
        console.error('Error adding food:', error);
        setError('Failed to add food. Please try again later.');
      });
  };

  return (
    <div className="bg-gradient-to-r from-pink-500 to-yellow-300 min-h-screen flex flex-col items-center justify-center py-12">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-96 relative">
        <div className="absolute -top-4 -right-4 bg-yellow-400 text-white rounded-full w-8 h-8 flex items-center justify-center text-xl font-bold shadow-md">
          🎂
        </div>
        <h1 className="text-4xl font-bold text-center text-pink-700 mb-2">Kedves {motherName}!</h1>
        <p className="text-center text-gray-600 mb-6">Boldog szülinapot! ❤️</p>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Új étel neve"
            value={newFood.name}
            onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <div className="flex items-center space-x-2">
            <label className="text-lg text-pink-700">Hétvégi étel?</label>
            <input
              type="checkbox"
              checked={newFood.weekend}
              onChange={(e) => setNewFood({ ...newFood, weekend: e.target.checked })}
              className="w-6 h-6 border-2 border-gray-300 rounded"
            />
          </div>
          <button
            onClick={handleAddFood}
            className="w-full py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-300"
          >
            Új étel hozzáadása
          </button>
        </div>
      </div>

      <div className="mt-8 w-full max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-pink-700">Heti menü</h2>
          <button
            onClick={handleRegenerateMenu}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-300 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Új menü generálása
          </button>
        </div>
        
        {/* Desktop view - visible on md screens and up */}
        <div className="hidden md:block">
          <table className="w-full table-auto border-collapse bg-white rounded-lg shadow-md overflow-hidden">
            <thead>
              <tr>
                <th className="px-4 py-3 text-center bg-pink-100 text-pink-700">Hétfő</th>
                <th className="px-4 py-3 text-center bg-pink-100 text-pink-700">Kedd</th>
                <th className="px-4 py-3 text-center bg-pink-100 text-pink-700">Szerda</th>
                <th className="px-4 py-3 text-center bg-pink-100 text-pink-700">Csütörtök</th>
                <th className="px-4 py-3 text-center bg-pink-100 text-pink-700">Péntek</th>
                <th className="px-4 py-3 text-center bg-pink-100 text-pink-700">Szombat</th>
                <th className="px-4 py-3 text-center bg-pink-100 text-pink-700">Vasárnap</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                {weeklyMenu.map((food, index) => (
                  <td key={index} className="px-4 py-3 text-center border-t border-gray-200">
                    <div className="font-medium">{food.name}</div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* Mobile view - visible on small screens */}
        <div className="md:hidden">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {weeklyMenu.map((food, index) => {
              const days = ["Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat", "Vasárnap"];
              return (
                <div key={index} className="flex flex-col border-b border-gray-200 last:border-b-0">
                  <div className="bg-pink-100 text-pink-700 px-4 py-2 font-medium">
                    {days[index]}
                  </div>
                  <div className="px-4 py-3">
                    <div className="font-medium">{food.name}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
