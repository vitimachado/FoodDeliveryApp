export const checkInArrayIfHasString = (str: string, arrString: string[]): boolean =>{
    return arrString.some(substr => str.includes(substr));
}
