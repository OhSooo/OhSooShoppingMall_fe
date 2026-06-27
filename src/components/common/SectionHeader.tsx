type Props = {
  title: string;
};

export default function SectionHeader({ title }: Props) {
  return (
    <div
      style={{
        backgroundColor: 'var(--color-point-main)',
        padding: '10px 20px',
        borderRadius: '4px 4px 0 0',
      }}
    >
      <span style={{ fontSize: '15px', fontWeight: 600, color: '#FFFFFF' }}>
        {title}
      </span>
    </div>
  );
}
