import {
  sequence,
  trigger,
  animate,
  style,
  group,
  query as q,
  transition,
  animateChild,
  state
} from "@angular/animations";
const query = (s, a, o = { optional: true }) => q(s, a, o);

export const routerTransition = trigger("routeAnimations", [
  state( 'void', style({
    opacity: 0
  }) ),

  // // fadeIn transition
  // transition( 'void <=> *', [
  //   animate(2000)
  // ] ),

  // // fadeOut transition
  // transition( '* => void', [
  //   animate(2000)
  // ] )

  transition( ':enter, :leave', [
    animate(2000)
  ] )
]);
