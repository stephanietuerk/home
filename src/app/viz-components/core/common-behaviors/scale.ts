import { BehaviorSubject, Observable } from 'rxjs';
import { AbstractConstructor, Constructor } from './constructor';

export interface CanXScale {
  xScale: BehaviorSubject<any>;
  xScale$: Observable<any>;
  updateXScale(scale: any): void;
}

type CanXScaleCtor = Constructor<CanXScale> & AbstractConstructor<CanXScale>;

export interface CanYScale {
  yScale: BehaviorSubject<any>;
  yScale$: Observable<any>;
  updateYScale(scale: any): void;
}

type CanYScaleCtor = Constructor<CanYScale> & AbstractConstructor<CanYScale>;

export interface CanCategoryScale {
  categoryScale: BehaviorSubject<any>;
  categoryScale$: Observable<any>;
  updateCategoryScale(scale: any): void;
}

type CanCategoryScaleCtor = Constructor<CanCategoryScale> &
  AbstractConstructor<CanCategoryScale>;

export function mixinXScale<T extends Constructor<object>>(
  base = class {} as T
): CanXScaleCtor & T {
  return class extends base {
    xScale: BehaviorSubject<any> = new BehaviorSubject(null);
    xScale$ = this.xScale.asObservable();

    updateXScale(scale: any): void {
      this.xScale.next(scale);
    }
  };
}

export function mixinYScale<T extends Constructor<object>>(
  base = class {} as T
): CanYScaleCtor & T {
  return class extends base {
    yScale: BehaviorSubject<any> = new BehaviorSubject(null);
    yScale$ = this.yScale.asObservable();

    updateYScale(scale: any): void {
      this.yScale.next(scale);
    }
  };
}

export function mixinCategoryScale<T extends Constructor<object>>(
  base = class {} as T
): CanCategoryScaleCtor & T {
  return class extends base {
    categoryScale: BehaviorSubject<any> = new BehaviorSubject(null);
    categoryScale$ = this.categoryScale.asObservable();

    updateCategoryScale(scale: any): void {
      this.categoryScale.next(scale);
    }
  };
}
