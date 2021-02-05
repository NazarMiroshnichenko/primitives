import * as React from 'react';
import { Label, useLabelContext } from './Label';
import { css } from '../../../../stitches.config';

export default { title: 'Components/Label', excludeStories: ['RECOMMENDED_CSS__LABEL__ROOT'] };

export const Styled = () => <Label className={rootClass}>Label</Label>;

export const AutoGeneratedId = () => (
  <Label className={rootClass}>
    Label <Control />
  </Label>
);

export const SuppliedId = () => (
  <Label id="test" className={rootClass}>
    Label <Control />
  </Label>
);

export const WithHtmlFor = () => (
  <>
    <Label htmlFor="test" className={rootClass}>
      This should add an `aria-labelledby` to the control
    </Label>
    <Control id="test" />
  </>
);

export const Chromatic = () => (
  <>
    <h1>Auto generated id</h1>
    <Label className={chromaticRootClass}>
      <Control />
    </Label>

    <h1>Supplied id</h1>
    <Label id="one" className={chromaticRootClass}>
      <Control />
    </Label>

    <h1>With htmlFor</h1>
    <Label htmlFor="two" className={chromaticRootClass}>
      {' '}
      This should add an `aria-labelledby` to the control
    </Label>
    <Control id="two" />

    <h1>Data attribute selectors</h1>
    <Label className={rootAttrClass}>
      <Control />
    </Label>
  </>
);
Chromatic.parameters = { chromatic: { disable: false } };

const Control = (props: any) => {
  const id = useLabelContext();
  return (
    <span aria-labelledby={id} className={controlClass} {...props}>
      Control is labelled by:{' '}
    </span>
  );
};

export const RECOMMENDED_CSS__LABEL__ROOT = {
  // ensures it can receive vertical margins
  display: 'inline-block',
  // better default alignment
  verticalAlign: 'middle',
  // mimics default `label` tag (as we render a `span`)
  cursor: 'default',
};

const rootClass = css({
  ...RECOMMENDED_CSS__LABEL__ROOT,
  display: 'inline-block',
  border: '1px solid gainsboro',
  padding: 10,
});

const controlClass = css({
  display: 'inline-block',
  border: '1px solid gainsboro',
  padding: 10,
  verticalAlign: 'middle',
  margin: '0 10px',

  '&::after': {
    content: 'attr(aria-labelledby)',
  },
});

const chromaticRootClass = css(rootClass, {
  '&::before': {
    content: 'attr(id)',
  },
});

const styles = {
  backgroundColor: 'rgba(0, 0, 255, 0.3)',
  border: '2px solid blue',
  padding: 10,
};
const rootAttrClass = css(chromaticRootClass, { '&[data-radix-label]': styles });
