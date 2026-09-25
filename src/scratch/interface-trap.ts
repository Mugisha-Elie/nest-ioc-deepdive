import 'reflect-metadata'
import { InjectableOptions, INJECTABLE_WATERMARK, SCOPE_OPTIONS_METADATA } from './reflection-experiment';

export interface IDataStore {
  save(key: string, value: string): void;
}

function Injectable(options: InjectableOptions): ClassDecorator {
  return (target: Function) => {
    Reflect.defineMetadata(INJECTABLE_WATERMARK, true, target);
    Reflect.defineMetadata(SCOPE_OPTIONS_METADATA, options ?? {scope: "SINGLETON"}, target)
  }
}

