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
    const span = max - min - 2 * eps;
    const safeSpan = span > 0 ? span : eps;
    const age = min + eps + Math.random() * safeSpan;
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

  let workload10 = 0;
  let workload20 = 0;
  let workload30 = 0;
  let workload40 = 0;

  const sortedByWorkload = [...employees].sort((a, b) => a.workload - b.workload);

  if (total === 0) {
    return {
      total: 0,
      workload10: 0,
      workload20: 0,
      workload30: 0,
      workload40: 0,
      averageAge: 0.0,
      minAge: 0,
      maxAge: 0,
      medianAge: 0,
      medianWorkload: 0,
      averageWomenWorkload: 0,
      sortedByWorkload
    };
  }

  const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000;

  const ages = [];
  const workloads = [];

  let womenSum = 0;
