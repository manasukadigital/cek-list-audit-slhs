import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

const oldPenaltyStatsBlock = `  const penaltyStats = useMemo(() => {
    let total = 0;
    let critical = 0;
    let major = 0;
    let minor = 0;
    checklistData.forEach(section => {
      section.subsections.forEach(sub => {
        sub.items.forEach(item => {
          if (item.penalties && answers[item.id] === 'TIDAK') {
            const penalty = item.penalties[golongan];
            if (typeof penalty === 'number') {
              total += penalty;
              if (penalty === 3) critical++;
              else if (penalty === 2) major++;
              else if (penalty === 1) minor++;
            }
          }
        });
      });
    });
    return { total, critical, major, minor };
  }, [answers, golongan]);`;

const newPenaltyStatsBlock = `  const penaltyStats = useMemo(() => {
    let total = 0;
    let critical = 0;
    let major = 0;
    let minor = 0;
    const criticalItems: { id: string; criteria: string; }[] = [];
    const majorItems: { id: string; criteria: string; }[] = [];
    
    checklistData.forEach(section => {
      section.subsections.forEach(sub => {
        sub.items.forEach(item => {
          if (item.penalties && answers[item.id] === 'TIDAK') {
            const penalty = item.penalties[golongan];
            if (typeof penalty === 'number') {
              total += penalty;
              if (penalty === 3) {
                critical++;
                criticalItems.push({ id: item.id, criteria: item.criteria });
              }
              else if (penalty === 2) {
                major++;
                majorItems.push({ id: item.id, criteria: item.criteria });
              }
              else if (penalty === 1) minor++;
            }
          }
        });
      });
    });
    return { total, critical, major, minor, criticalItems, majorItems };
  }, [answers, golongan]);`;

content = content.replace(oldPenaltyStatsBlock, newPenaltyStatsBlock);

const oldScoreCardBottom = `              <div className="flex justify-center gap-4 mt-2">
                <span className="font-medium text-slate-700">Pelanggaran Kritis (Skor 3): <span className="font-bold text-red-600">{penaltyStats.critical}</span></span>
                <span className="font-medium text-slate-700">Mayor (Skor 2): <span className="font-bold text-orange-500">{penaltyStats.major}</span></span>
                <span className="font-medium text-slate-700">Minor (Skor 1): <span className="font-bold text-yellow-600">{penaltyStats.minor}</span></span>
              </div>
            </div>
          </div>
        </section>`;

const newScoreCardBottom = `              <div className="flex justify-center gap-4 mt-2">
                <span className="font-medium text-slate-700">Pelanggaran Kritis (Skor 3): <span className="font-bold text-red-600">{penaltyStats.critical}</span></span>
                <span className="font-medium text-slate-700">Mayor (Skor 2): <span className="font-bold text-orange-500">{penaltyStats.major}</span></span>
                <span className="font-medium text-slate-700">Minor (Skor 1): <span className="font-bold text-yellow-600">{penaltyStats.minor}</span></span>
              </div>
            </div>

            {(penaltyStats.criticalItems.length > 0 || penaltyStats.majorItems.length > 0) && (
              <div className="mt-6 w-full text-left">
                {penaltyStats.criticalItems.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-bold text-red-700 mb-2 flex items-center gap-2 text-sm">
                      <XCircle className="w-5 h-5" />
                      Pelanggaran Kritis (Skor 3) - Wajib Diperbaiki Segera
                    </h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700 bg-red-50 p-4 rounded-xl border border-red-100">
                      {penaltyStats.criticalItems.map(item => (
                        <li key={item.id}>{item.criteria}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {penaltyStats.majorItems.length > 0 && (
                  <div>
                    <h4 className="font-bold text-[#F15A24] mb-2 flex items-center gap-2 text-sm">
                      <AlertTriangle className="w-5 h-5" />
                      Temuan Mayor (Skor 2) - Buat Catatan Perbaikan
                    </h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700 bg-orange-50 p-4 rounded-xl border border-orange-100">
                      {penaltyStats.majorItems.map(item => (
                        <li key={item.id}>{item.criteria}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>`;

content = content.replace(oldScoreCardBottom, newScoreCardBottom);

fs.writeFileSync('src/App.tsx', content);
console.log('App.tsx violations list added.');
