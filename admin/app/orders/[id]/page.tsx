import OrderDetailClient from './OrderDetailClient';

export function generateStaticParams() {
  return [{ id: 'all' }, { id: 'placeholder' }];
}

export default function Page() {
  return <OrderDetailClient />;
}
