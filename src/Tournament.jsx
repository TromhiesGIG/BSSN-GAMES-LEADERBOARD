import { useState, useEffect } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { database } from './firebase';
import { ref, onValue, set, push, remove } from 'firebase/database';

export default function TournamentTracker() {
  const [teams, setTeams] = useState([]);
  const [newTeamName, setNewTeamName] = useState('');

  useEffect(() => {
    const teamsRef = ref(database, 'teams');
    onValue(teamsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const teamsList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setTeams(teamsList);
      } else {
        setTeams([]);
      }
    });
  }, []);

  const updateScore = (id, game, value) => {
    const teamRef = ref(database, `teams/${id}/${game}`);
    set(teamRef, Math.max(0, parseInt(value) || 0));
  };

  const addTeam = () => {
    if (newTeamName.trim()) {
      const teamsRef = ref(database, 'teams');
      const newTeamRef = push(teamsRef);
      set(newTeamRef, {
        name: newTeamName,
        FC24: 0, MK: 0, Dominoes: 0, UNO: 0, Chess: 0, Blooket: 0
      });
      setNewTeamName('');
    }
  };

  const deleteTeam = (id) => {
    const teamRef = ref(database, `teams/${id}`);
    remove(teamRef);
  };

  const getTotal = (team) => {
    return team.FC24 + team.MK + team.Dominoes + team.UNO + team.Chess + team.Blooket;
  };

  const sortedTeams = [...teams].sort((a, b) => getTotal(b) - getTotal(a));

  const games = ['FC24', 'MK', 'Dominoes', 'UNO', 'Chess', 'Blooket'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-900 mb-2">BSSN GAMES TOURNAMENT</h1>
          <p className="text-indigo-700">Score Tracker & Leaderboard</p>
        </div>

        {/* Add Team Section */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter team name..."
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTeam()}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={addTeam}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
            >
              <Plus size={18} /> Add Team
            </button>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-indigo-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Rank</th>
                  <th className="px-4 py-3 text-left">Team</th>
                  {games.map(g => <th key={g} className="px-3 py-3 text-center text-sm">{g}</th>)}
                  <th className="px-4 py-3 text-center font-bold">Total</th>
                </tr>
              </thead>
              <tbody>
                {sortedTeams.map((team, idx) => (
                  <tr key={team.id} className={idx < 3 ? (idx === 0 ? 'bg-yellow-50' : idx === 1 ? 'bg-gray-50' : 'bg-orange-50') : 'hover:bg-gray-50'}>
                    <td className="px-4 py-3 font-bold text-indigo-600">{idx + 1}</td>
                    <td className="px-4 py-3 font-semibold text-gray-800">{team.name}</td>
                    {games.map(g => (
                      <td key={g} className="px-3 py-3 text-center">
                        <input
                          type="number"
                          value={team[g]}
                          onChange={(e) => updateScore(team.id, g, e.target.value)}
                          className="w-12 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-indigo-400"
                          min="0"
                        />
                      </td>
                    ))}
                    <td className="px-4 py-3 text-center font-bold text-indigo-600">{getTotal(team)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Delete Team Section */}
        {teams.length > 0 && (
          <div className="bg-red-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-red-900 mb-3">Remove Teams</h3>
            <div className="flex flex-wrap gap-2">
              {teams.map(team => (
                <button
                  key={team.id}
                  onClick={() => deleteTeam(team.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 flex items-center gap-1"
                >
                  <Trash2 size={14} /> {team.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}