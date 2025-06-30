import { CircleLoader } from 'react-spinners';

export default function LoadingScreen() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
      <CircleLoader color="#000000" loading={true} size={60} />
    </div>
  );
}
