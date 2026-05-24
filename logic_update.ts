import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

const oldTotalPenaltyBlock = `  const totalPenalty = useMemo(() => {
    let score = 0;
    checklistData.forEach(section => {
      section.subsections.forEach(sub => {
        sub.items.forEach(item => {
          if (item.penalties && answers[item.id] === 'TIDAK') {
            const penalty = item.penalties[golongan];
            if (typeof penalty === 'number') {
              score += penalty;
            }
          }
        });
      });
    });
    return score;
  }, [answers, golongan]);`;

const newTotalPenaltyBlock = `  const penaltyStats = useMemo(() => {
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
  }, [answers, golongan]);

  const totalPenalty = penaltyStats.total;`;

content = content.replace(oldTotalPenaltyBlock, newTotalPenaltyBlock);

const oldFinalScoreBlock = `  const finalScore = useMemo(() => {
    return Math.max(0, 100 - ((totalPenalty / maxPenalty) * 100)).toFixed(2);
  }, [totalPenalty, maxPenalty]);`;

const newFinalScoreBlock = `  const finalScoreNum = useMemo(() => {
    return Math.max(0, 100 - ((totalPenalty / maxPenalty) * 100));
  }, [totalPenalty, maxPenalty]);
  
  const finalScore = finalScoreNum.toFixed(2);`;

content = content.replace(oldFinalScoreBlock, newFinalScoreBlock);

fs.writeFileSync('src/App.tsx', content);
console.log('App.tsx data dependencies updated.');
