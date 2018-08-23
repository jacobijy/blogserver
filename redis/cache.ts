import redis from '.';
import logger from '../utils/logger';

export async function get(key: string) {
	const t = new Date();
	try {
		const value = await redis.get(key);
		const data = JSON.parse(value);

		const duration = (new Date().getTime() - t.getTime());
		logger().debug('Cache', 'get', key, (duration + 'ms'));
		return data;
	} catch (err) {
		return err;
	}
}

export async function set(key: string, value: string, time: number) {
	const t = new Date();
	try {
		let result;
		value = JSON.stringify(value);
		if (time) {
			result = await redis.setex(key, time, value);
		}
		else {
			result = await redis.set(key, value);
		}
		const duration = (new Date().getTime() - t.getTime());
		logger().debug('Cache', 'set', key, (duration + 'ms'));
		return result;
	} catch (err) {
		return err;
	}
}

export async function hset(key: string, field: string, value: string) {
	try {
		let result = await redis.hset(key, field, value);
		return result;
	} catch (err) {
		return err;
	}
}

export async function hget(key:string, field: string) {
	try {
		let value = await redis.hget(key, field);
		return value;
	} catch (err) {
		console.log(err);
		return;
	}
}

export async function lpush(key:string, value: string) {
	try {
		let result = await redis.lpushx(key, value);
		return result;
	} catch (err) {
		return err;
	}
}

export async function lrange(key: string, start: number, end: number) {
	try {
		let result = await redis.lrange(key, start, end);
		return result;
	} catch (err) {
		console.log(err);
		return;
	}
}
