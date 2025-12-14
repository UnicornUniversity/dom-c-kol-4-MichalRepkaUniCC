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

  const maleNames = ["Jan", "Petr", "Jiří", "Tomáš", "Martin", "David", "Michal"];
  const femaleNames = ["Jana", "Anna", "Lucie", "Petra", "Lenka", "Martina"];
  const surnames = ["Novák", "Svoboda", "Dvořák", "Černý", "Procházka"];
  const workloads = [10, 20, 30, 40];

  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const pick = (arr) => arr[rand(0, arr.length - 1)];

  const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000;

  function randomBirthdate(min, max) {
    const eps = 0.0001;
    const age = min + eps + Math.random() * (max - min - 2 * eps);
    return new Date(Date.now() - age * MS_PER_YEAR).toISOString();
  }

  const result = [];
  for (let i = 0; i < count; i++) {
    const gender = Math.random() < 0.5 ? "male" : "female";
    result.push({
      gender,
      birthdate: randomBirthdate(minAge, maxAge),
      name: gender === "male" ? pick(maleNames) : pick(femaleNames),
      surname: pick(surnames),
      workload: pick(workloads)
    });
  }

  return result;
}

export function getEmployeeStatistics(employees) {
  const total = employees.length;
  const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000;

  const ages = [];
  const workloads = [];

  let workload10 = 0;
  let workload20 = 0;
  let workload30 = 0;
  let workload40 = 0;

  let womenSum = 0;
  let womenCount = 0;

  for (const e of employees) {
    const age = (Date.now() - new Date(e.birthdate)) / MS_PER_YEAR;
    ages.push(age);
    workloads.push(e.workload);

    if (e.workload === 10) workload10++;
    if (e.workload === 20) workload20++;
    if (e.workload === 30) workload30++;
    if (e.workload === 40) workload40++;

    if (e.gender === "female") {
      womenSum += e.workload;
      womenCount++;
    }
  }

  ages.sort((a, b) => a - b);
  workloads.sort((a, b) => a - b);

  const round1 = (x) => Math.round(x * 10) / 10;
  const round0 = (x) => Math.round(x);

  const median = (arr) => {
    const m = Math.floor(arr.length / 2);
    return arr.length % 2 ? arr[m] : (arr[m - 1] + arr[m]) / 2;
  };

  const averageAge = round1(ages.reduce((s, a) => s + a, 0) / total);
  const minAge = round0(ages[0]);
  const maxAge = round0(ages[ages.length - 1]);
  const medianAge = round0(median(ages));
  const medianWorkload = round0(median(workloads));
  const averageWomenWorkload = womenCount ? round1(womenSum / womenCount) : 0;

  const sortedByWorkload = [...employees].sort(
    (a, b) => a.workload - b.workload
  );

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
