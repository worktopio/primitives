import * as React from 'react';
import { Primitive } from '@radix-ui/react-primitive';

import type * as Radix from '@radix-ui/react-primitive';

/* -------------------------------------------------------------------------------------------------
 * Arrow
 * -----------------------------------------------------------------------------------------------*/

const ROOT_NAME = 'Arrow';

type ArrowElement = React.ElementRef<typeof Primitive.svg>;
type PrimitiveSvgProps = Radix.ComponentPropsWithoutRef<typeof Primitive.svg>;
interface ArrowProps extends PrimitiveSvgProps {}

const Arrow = React.forwardRef<ArrowElement, ArrowProps>((props, forwardedRef) => {
  const {
    __scope = ROOT_NAME,
    __part = ROOT_NAME,
    children,
    width = 10,
    height = 5,
    ...arrowProps
  } = props;
  return (
    <Primitive.svg
      {...arrowProps}
      __scope={__scope}
      __part={__part}
      ref={forwardedRef}
      width={width}
      height={height}
      viewBox="0 0 30 10"
      preserveAspectRatio="none"
    >
      {/* We use their children if they're slotting to replace the whole svg */}
      {props.asChild ? children : <polygon points="0,0 30,0 15,10" />}
    </Primitive.svg>
  );
});

Arrow.displayName = ROOT_NAME;

/* -----------------------------------------------------------------------------------------------*/

const Root = Arrow;

export {
  Arrow,
  //
  Root,
};
export type { ArrowProps };
