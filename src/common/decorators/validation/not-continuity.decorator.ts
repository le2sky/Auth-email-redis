import { registerDecorator, ValidationOptions } from 'class-validator';
/*
TODO: 1. temp boolean or number 인데 logic 다시 짜야함
       -> temp가 boolean 일 수도 있어서 += 연산 불가
      2. 연속된 숫자 역순
      3. 지금은 4개 연속 숫자이지만, 데코레이터 팩토리에서 숫자를 입력받아서 할 수 있도록
      4. 로직이 길어졌음

Description: 
      1.검사할 대상에 양수 방향으로 4개 연속된 숫자가 포함되어 있는 지 검사하는 데코레이터입니다.
      2.createDTO에서 validation을 수행합니다.
      3.평문 password를 validation하기 때문에 signup request dto에 적합합니다.
*/
export function NotContinutyPasswordNumber(
  validationOptions?: ValidationOptions,
) {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      name: 'NotContinutyPasswordNumber',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        // logic
        validate(value: any) {
          let temp: any = 0;
          [...value.trim()].forEach(
            (item: string, index: number, arr: string[]) => {
              if (+item && index + 3 <= arr.length) {
                if (
                  !isNaN(+arr[index + 1]) &&
                  !isNaN(+arr[index + 2]) &&
                  !isNaN(+arr[index + 3])
                ) {
                  temp =
                    +arr[index] + 1 === +arr[index + 1] ? (temp += 1) : false;
                  temp =
                    temp && +arr[index + 1] + 1 === +arr[index + 2]
                      ? (temp += 1)
                      : false;
                  temp =
                    temp && +arr[index + 2] + 1 === +arr[index + 3]
                      ? (temp += 1)
                      : false;
                }
              }
            },
          );
          return temp ? false : true;
        },
      },
    });
  };
}
