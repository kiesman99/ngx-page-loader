import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Angular Resolvers+',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Angular Resolvers are great but they lack some features. This library is an attempt to add some of the missing features and make development in Angular a bit more fun.
      </>
    ),
  },
  {
    title: 'Fully Typed',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Access your loader data with full type safety and optionally define the structure of your path and query parameters with the awesome validation library <a href="https://zod.dev/" target="_blank">zod</a>.
      </>
    ),
  },
  {
    title: 'No subscriptions needed',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        You know the hassle of unsubscribing from subscriptions. This library takes care of that for you! No more memory leaks!
      </>
    ),
  },
  {
    title: 'Loading State',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Keep track of the loading state of your data. This library provides a loading state for each loader so you can inform your users about pending data.
      </>
    ),
  },
  {
    title: 'Long Loading Data',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Sometimes fetching data is slow and we can't change that. We provide utilities to handle this case and give you the tools to inform your users about the slow loading data.
      </>
    ),
  },
  {
    title: 'Data Mutations',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        An application without changing data is not very useful. This library provides utilities to mutate your data and keep your application in sync.
      </>
    ),
  },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
