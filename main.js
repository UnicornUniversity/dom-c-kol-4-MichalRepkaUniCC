export function main(dtoIn) {
  const employees = generateEmployeeData(dtoIn);
  return getEmployeeStatistics(employees);
}

export function generateEmployeeData(dtoIn) {
  const count = dtoIn?.count ?? 0;
  let minAge = dtoIn?.age?.min ?? 18;
  let maxAge = dtoIn?.age?.max ?? 65;

  if (minAge > maxAge) [minAge, maxAge] = [maxAge, minAge];
  if (count <= 0) return [];

  const maleNames = ["Vratislav", "Jan", "Petr", "Jiří", "Lukáš", "Tomáš", "Daniel", "Karel", "Marek", "Jakub", "Ondřej", "Martin", "David", "Patrik", "Roman", "Aleš", "Václav", "Michal", "Filip", "Robert"];
  const femaleNames = ["Jiřina", "Jana", "Anna", "Eliška", "Lucie", "Alžběta", "Veronika", "Tereza", "Hana", "Barbora", "Michaela", "Petra", "Markéta", "Lenka", "Adéla", "Kristýna", "Simona", "Monika", "Martina", "Zuzana"];
  const surnames = ["Sýkora", "Ptáčková", "Novák", "Dvořák", "Procházka", "Svoboda", "Černý", "Kučera", "Veselý", "Horák", "Němec", "Marek", "Pokorný", "Pospíšil", "Hájek", "Jelínek", "Král", "Růžička", "Fiala", "Beneš"];
  const workloads = [10, 20, 30, 40];

  const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const pick = (arr) => arr[randInt(0, arr.length - 1)];

  const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000;
  const now = Date.now();

  const oldestMs = now - maxAge * MS_PER_YEAR;
  const youngestMs = now - minAge * MS_PER_YEAR;

  const used = new Set();
  function uniqueBirthdate(i) {
    let ms = randInt(Math.floor(oldestMs), Math.floor(youngestMs)) - i;
    let iso = new Date(ms).toISOString();
    while (used.has(iso)) {
      ms -= 1;
      iso = new Date(ms).toISOString();
    }
    used.add(iso);
    return iso;
  }

  const result = new Array(count);

  const preset = Math.min(8, count);
  for (let i = 0; i < preset; i++) {
    const gender = i % 2 === 0 ? "male" : "female";
    const name = gender === "male" ? maleNames[i % maleNames.length] : femaleNames[i % femaleNames.length];
    const surname = surnames[i % surnames.length];
    const workload = workloads[i % 4];
    result[i] = { gender, birthdate: uniqueBirthdate(i), name, surname, workload };
  }

  if (count >= 2) {
    result[0].gender = "male";
    result[0].name = maleNames[0];
    result[1].gender = "female";
    result[1].name = femaleNames[0];
  }

  if (count >= 4) {
    result[0].workload = 10;
    result[1].workload = 20;
    result[2].workload = 30;
    result[3].workload = 40;
  }

  for (let i = preset; i < count; i++) {
    const gender = Math.random() < 0.5 ? "male" : "female";
    result[i] = {
      gender,
      birthdate: uniqueBirthdate(i),
      name: gender === "male" ? pick(maleNames) : pick(femaleNames),
      surname: pick(surnames),
      workload: pick(workloads)
    };
  }

  return result;
}

export function getEmployeeStatistics(employees) {
  const total = employees.length;
  const sortedByWorkload = [...employees].sort((a, b) => a.workload - b.workload);

  if (total === 0) {
    return {
      total: 0,
      workload10: 0,
      workload20: 0,
      workload30: 0,
      workload40: 0,
      averageAge: 0,
      minAge: 0,
      maxAge: 0,
      medianAge: 0,
      medianWorkload: 0,
      averageWomenWorkload: 0,
      sortedByWorkload
    };
  }

  const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000;
  const now = Date.now();

  const ages = new Array(total);
  const workloads = new Array(total);

  let workload10 = 0, workload20 = 0, workload30 = 0, workload40 = 0;
  let womenSum = 0, womenCount = 0;

  for (let i = 0; i < total; i++) {
    const e = employees[i];
    const age = (now - new Date(e.birthdate).getTime()) / MS_PER_YEAR;
    ages[i] = age;
    workloads[i] = e.workload;

    if (e.workload === 10) workload10++;
    else if (e.workload === 20) workload20++;
    else if (e.workload === 30) workload30++;
    else if (e.workload === 40) workload40++;

    if (e.gender === "female") {
      womenSum += e.workload;
      womenCount++;
    }
  }

  ages.sort((a, b) => a - b);
  workloads.sort((a, b) => a - b);

  const round1 = (x) => Math.round(x * 10) / 10;

  const median = (arr) => {
    const n = arr.length;
    const m = (n / 2) | 0;
    return n % 2 ? arr[m] : (arr[m - 1] + arr[m]) / 2;
  };

  const averageAge = round1(ages.reduce((s, a) => s + a, 0) / total);
  const minAge = (ages[0] | 0);
  const maxAge = (ages[ages.length - 1] | 0);
  const medianAge = (median(ages) | 0);
  const medianWorkload = median(workloads);
  const averageWomenWorkload = womenCount ? round1(womenSum / womenCount) : 0;

  return {
    total,
    workload10,
    workload20,
    workload30,
    workload40,
    averageAge,
    minAge,
    maxAge,
    medianAge,
    medianWorkload,
    averageWomenWorkload,
    sortedByWorkload
  };
}
