/**
 * Password validator for login pages
 */
import { NumbColorFunc, StringBoolFunc, StringNumFunc }  from '../types';
import value from 'assets/scss/_themes-vars.module.scss';

// has number
const hasNumber: StringBoolFunc = (number) => new RegExp(/[0-9]/).test(number);

// has mix of small and capitals
const hasMixed: StringBoolFunc = (number) => new RegExp(/[a-z]/).test(number) && new RegExp(/[A-Z]/).test(number);

// has special chars
const hasSpecial: StringBoolFunc = (number) => new RegExp(/[!#@$%^&*)(+=._-]/).test(number);

// set color based on password strength
export const strengthColor: NumbColorFunc = (count) => {
    if (count < 2) return { label: 'Mật khẩu yếu', color: value.errorMain };
    if (count < 3) return { label: 'Mật khẩu yếu', color: value.warningDark };
    if (count < 4) return { label: 'Mật trung bình', color: value.orangeMain };
    if (count < 5) return { label: 'Mật tốt', color: value.successMain };
    if (count < 6) return { label: 'Mật mạnh', color: value.successDark };
    return { label: 'Poor', color: value.errorMain };
};

// password strength indicator
export const strengthIndicator: StringNumFunc = (number) => {
    let strengths = 0;
    if (number?.length > 5) strengths += 1;
    if (number?.length > 7) strengths += 1;
    if (hasNumber(number)) strengths += 1;
    if (hasSpecial(number)) strengths += 1;
    if (hasMixed(number)) strengths += 1;
    return strengths;
};
