import { ReplaySubject } from 'rxjs';

export function componentDestroyed(component: any, test: any) {
  console.log(component)
  const oldNgOnDestroy = component.ngOnDestroy;
  const destroyed$ = new ReplaySubject<void>(1);

  component.ngOnDestroy(() => {
    console.log(component);
    console.log('comp destroyed',test);
    oldNgOnDestroy.apply(component);
    destroyed$.next(undefined);
    destroyed$.complete();
  });
  return destroyed$;
}

// export function takeUntilComponentDestroyed(component: OnDestroy) {
//   const componentDestroyed = (comp: OnDestroy) => {
//     const oldNgOnDestroy = comp.ngOnDestroy;
//     const destroyed$ = new ReplaySubject<void>(1);
//     comp.ngOnDestroy = () => {
//       oldNgOnDestroy.apply(comp);
//       destroyed$.next(undefined);
//       destroyed$.complete();
//     };
//     return destroyed$;
//   };

//   return takeUntil(componentDestroyed(component))
 
// }


