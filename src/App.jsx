import React, { useState } from 'react';

function App() {
  const [fecha, setFecha] = useState('21-Sep');
  const [propinaTotal, setPropinaTotal] = useState(3000000);

  const [garzones, setGarzones] = useState([
    { id: 1, nombre: '', turno: 'Turno 1', entrada: '06:30', salida: '15:00' },
    { id: 2, nombre: '', turno: 'Turno 2', entrada: '06:30', salida: '15:00' },
    { id: 3, nombre: '', turno: 'Turno 3', entrada: '12:00', salida: '21:30' },
    { id: 4, nombre: '', turno: 'Turno 4', entrada: '13:00', salida: '21:30' },
    { id: 5, nombre: '', turno: 'Turno 5', entrada: '14:00', salida: '21:30' },
    { id: 6, nombre: '', turno: 'Turno 6', entrada: '15:00', salida: '21:30' },
  ]);

  const calcularHoras = (entrada, salida) => {
    if (!entrada || !salida) return 0;
    const [hEntrada, mEntrada] = entrada.split(':').map(Number);
    const [hSalida, mSalida] = salida.split(':').map(Number);

    const minutosEntrada = (hEntrada || 0) * 60 + (mEntrada || 0);
    const minutosSalida = (hSalida || 0) * 60 + (mSalida || 0);

    let diferenciaMinutos = minutosSalida - minutosEntrada;
    if (diferenciaMinutos < 0) diferenciaMinutos += 24 * 60;

    return Number((diferenciaMinutos / 60).toFixed(2));
  };

  const garzonesConHoras = garzones.map(g => ({
    ...g,
    horas: calcularHoras(g.entrada, g.salida)
  }));

  const totalHoras = garzonesConHoras.reduce((acc, item) => acc + item.horas, 0);
  const garzonesEnTurno = garzonesConHoras.filter(g => g.horas > 0).length;
  const valorPropinaPorHora = totalHoras > 0 ? propinaTotal / totalHoras : 0;

  const handleFieldChange = (id, campo, valor) => {
    setGarzones(garzones.map(g => g.id === id ? { ...g, [campo]: valor } : g));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 py-8 px-4 print:bg-white print:p-0">
      <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden print:shadow-none">
        
        {/* Cabecera Superior */}
        <div className="bg-slate-900 text-white px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-wide">Calculadora de Propinas</h1>
            <p className="text-slate-400 text-sm">Gestión y distribución de turnos</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700">
              <label className="text-xs text-slate-400 block font-semibold">FECHA</label>
              <input 
                type="text" 
                value={fecha} 
                onChange={(e) => setFecha(e.target.value)} 
                className="bg-transparent text-white font-bold text-lg w-24 outline-none focus:ring-1 focus:ring-blue-500 rounded px-1"
              />
            </div>

            <button 
              onClick={handlePrint}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 transition duration-200 print:hidden"
            >
              🖨️ Exportar PDF
            </button>
          </div>
        </div>

        <div className="p-8">
          
          {/* Tarjeta de Propina Total destacada */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-md mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <span className="text-emerald-100 font-medium text-sm tracking-wider uppercase">Monto Total a Distribuir</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-3xl font-extrabold">$</span>
                <input 
                  type="number" 
                  value={propinaTotal} 
                  onChange={(e) => setPropinaTotal(Number(e.target.value))} 
                  className="text-3xl font-extrabold bg-transparent text-white w-64 outline-none border-b border-emerald-300 focus:border-white transition"
                />
              </div>
            </div>
            <div className="text-right sm:text-right text-emerald-100 text-sm bg-emerald-700/40 px-4 py-3 rounded-xl border border-emerald-400/30">
              <p>💡 El cálculo se actualiza</p>
              <p className="font-semibold text-white">en tiempo real</p>
            </div>
          </div>

          {/* Tarjetas de Resumen */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl shadow-sm text-center">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Horas Trabajadas</p>
              <p className="text-3xl font-extrabold text-slate-800 mt-2">{totalHoras} hrs</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl shadow-sm text-center">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Garzones en Turno</p>
              <p className="text-3xl font-extrabold text-slate-800 mt-2">{garzonesEnTurno}</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl shadow-sm text-center">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Valor Propina por Hora</p>
              <p className="text-3xl font-extrabold text-emerald-600 mt-2">
                ${valorPropinaPorHora.toLocaleString('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {/* Tabla Moderna */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
            <table className="w-full border-collapse bg-white text-left">
              <thead>
                <tr className="bg-slate-100 text-slate-700 uppercase text-xs font-bold tracking-wider border-b border-slate-200">
                  <th className="p-4">Nombre Garzón</th>
                  <th className="p-4 text-center">Turno</th>
                  <th className="p-4 text-center">Entrada</th>
                  <th className="p-4 text-center">Salida</th>
                  <th className="p-4 text-center">Horas</th>
                  <th className="p-4 text-center">% Part.</th>
                  <th className="p-4 text-right">Propina a Pagar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {garzonesConHoras.map((g) => {
                  const porcentaje = totalHoras > 0 ? (g.horas / totalHoras) * 100 : 0;
                  const propinaPagar = (propinaTotal * porcentaje) / 100;

                  return (
                    <tr key={g.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-4">
                        <input 
                          type="text" 
                          value={g.nombre} 
                          onChange={(e) => handleFieldChange(g.id, 'nombre', e.target.value)}
                          className="border border-slate-300 rounded-lg px-3 py-1.5 w-full bg-white font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none print:border-none print:bg-transparent"
                        />
                      </td>
                      <td className="p-4 text-center text-slate-600 font-medium text-sm">{g.turno}</td>
                      <td className="p-4 text-center">
                        <input 
                          type="text" 
                          value={g.entrada} 
                          onChange={(e) => handleFieldChange(g.id, 'entrada', e.target.value)}
                          className="border border-slate-300 rounded-lg w-24 text-center py-1.5 bg-white text-slate-700 font-medium focus:ring-2 focus:ring-blue-500 outline-none print:border-none print:bg-transparent"
                        />
                      </td>
                      <td className="p-4 text-center">
                        <input 
                          type="text" 
                          value={g.salida} 
                          onChange={(e) => handleFieldChange(g.id, 'salida', e.target.value)}
                          className="border border-slate-300 rounded-lg w-24 text-center py-1.5 bg-white text-slate-700 font-medium focus:ring-2 focus:ring-blue-500 outline-none print:border-none print:bg-transparent"
                        />
                      </td>
                      <td className="p-4 text-center font-bold text-blue-600">
                        {g.horas} h
                      </td>
                      <td className="p-4 text-center font-semibold text-slate-600">{porcentaje.toFixed(1)}%</td>
                      <td className="p-4 text-right font-extrabold text-emerald-600 text-lg">
                        ${Math.round(propinaPagar).toLocaleString('es-CL')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>
        <footer className="bg-slate-900 text-slate-400 py-6 text-center text-sm border-t border-slate-800 print:hidden">
          <p>Desarrollado por BRBC • 2026</p>
        </footer>
      </div>
    </div>
  );
}

export default App;