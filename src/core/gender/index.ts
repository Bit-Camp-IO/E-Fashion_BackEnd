export enum Gender {
  MALE = 0,
  FEMALE = 1,
  BOTH = 2,
}

export function stringToGender(g?: string): Gender | undefined {
  if (!g) return undefined;
  g = g.toLowerCase();
  switch (g) {
    case '0':
    case 'male':
      return Gender.MALE;
    case '1':
    case 'female':
      return Gender.FEMALE;
    case '2':
    case 'both':
      return Gender.BOTH;
  }
  return undefined;
}
