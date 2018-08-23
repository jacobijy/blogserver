import { hash, compare } from 'bcryptjs';
import * as moment from 'moment';

moment.locale('zh-cn'); // 使用中文

// 格式化时间
export function formatDate(date: moment.MomentInput, friendly: boolean = false) {
    date = moment(date);

    if (friendly) {
        return date.fromNow();
    } else {
        return date.format('YYYY-MM-DD HH:mm');
    }

}

export function validateId(str: string) {
    return (/^[a-zA-Z0-9\-_]+$/i).test(str);
}

export function bhash(str: string) {
    return hash(str, 10);
}

export function bcompare(str: string, hashStr: string) {
    return compare(str, hashStr);
}

export function getFileSuffix(str: string) {
    let index1 = str.lastIndexOf('.');
    let index2 = str.length;
    return str.substring(index1 + 1, index2);
}

export function getImageNameFromUrl(url: string) {
    const regex1 = /\/([^/?]+)\?/;
    if (regex1.test(url)) { return url.split(regex1)[1]; }
    const array = url.split('/');
    return array[array.length - 1];
}

export function quickSort<T>(arr: T[], compareFunc?: (a: T, b: T) => boolean): T[] {
    // 如果数组<=1,则直接返回
    if (arr.length <= 1) {
        return arr;
    }
    let pivotIndex = Math.floor(arr.length / 2);
    // 找基准
    let pivot = arr[pivotIndex];
    // 定义左右数组
    let left = new Array<T>();
    let right = new Array<T>();

    // 比基准小的放在left，比基准大的放在right
    for (let i = 0; i < arr.length; i++) {
        if (i !== pivotIndex) {
            if (compare) {
                if (compareFunc(arr[i], pivot)) {
                    left.push(arr[i]);
                } else {
                    right.push(arr[i]);
                }
            } else {
                if (arr[i] <= pivot) {
                    left.push(arr[i]);
                } else {
                    right.push(arr[i]);
                }
            }
        }
    }
    // 递归
    return quickSort(left, compareFunc).concat([pivot], quickSort(right, compareFunc));
}
