export enum Gender {
  BOTH = 0,
  MALE = 1,
  FEMALE = 2,
}

export function stringToGender(g?: string): Gender | undefined {
  if (!g) return undefined;
  g = g.toLowerCase();
  switch (g) {
    case '0':
    case 'both':
      return Gender.BOTH;
    case '1':
    case 'male':
      return Gender.MALE;
    case '2':
    case 'female':
      return Gender.FEMALE;
  }
  return undefined;
}
