export default function AnimatedShapes() {
  const shapes = [
    { size: 'lg', pos: 's1', style: { position: 'fixed', background: 'rgba(255, 193, 7, 0.15)', zIndex: -1, borderRadius: '10px', width: '500px', height: '500px', top: '-150px', right: '-200px', animation: 'moveShape 25s linear infinite' } },
    { size: 'md', pos: 's2', style: { position: 'fixed', background: 'rgba(255, 193, 7, 0.15)', zIndex: -1, borderRadius: '10px', width: '350px', height: '350px', top: '300px', left: '-150px', animation: 'moveShape 25s linear infinite' } },
    { size: 'sm', pos: 's3', style: { position: 'fixed', background: 'rgba(255, 193, 7, 0.15)', zIndex: -1, borderRadius: '10px', width: '200px', height: '200px', bottom: '-200px', right: '-200px', animation: 'moveShape 25s linear infinite' } },
    { size: 'lg', pos: 's4', style: { position: 'fixed', background: 'rgba(255, 193, 7, 0.15)', zIndex: -1, borderRadius: '10px', width: '500px', height: '500px', bottom: '200px', left: '-150px', animation: 'moveShape 25s linear infinite' } },
    { size: 'md', pos: 's5', style: { position: 'fixed', background: 'rgba(255, 193, 7, 0.15)', zIndex: -1, borderRadius: '10px', width: '350px', height: '350px', top: '900px', right: '-200px', animation: 'moveShape 25s linear infinite' } },
    { size: 'sm', pos: 's6', style: { position: 'fixed', background: 'rgba(255, 193, 7, 0.15)', zIndex: -1, borderRadius: '10px', width: '200px', height: '200px', bottom: '700px', left: '-200px', animation: 'moveShape 25s linear infinite' } },
    { size: 'lg', pos: 's7', style: { position: 'fixed', background: 'rgba(255, 193, 7, 0.15)', zIndex: -1, borderRadius: '10px', width: '500px', height: '500px', top: '1500px', right: '-200px', animation: 'moveShape 25s linear infinite' } },
    { size: 'md', pos: 's8', style: { position: 'fixed', background: 'rgba(255, 193, 7, 0.15)', zIndex: -1, borderRadius: '10px', width: '350px', height: '350px', top: '1800px', left: '-200px', animation: 'moveShape 25s linear infinite' } },
    { size: 'sm', pos: 's9', style: { position: 'fixed', background: 'rgba(255, 193, 7, 0.15)', zIndex: -1, borderRadius: '10px', width: '200px', height: '200px', top: '500px', right: '-300px', animation: 'moveShape 25s linear infinite' } },
    { size: 'lg', pos: 's10', style: { position: 'fixed', background: 'rgba(255, 193, 7, 0.15)', zIndex: -1, borderRadius: '10px', width: '500px', height: '500px', bottom: '1200px', left: '-300px', animation: 'moveShape 25s linear infinite' } },
    { size: 'md', pos: 's11', style: { position: 'fixed', background: 'rgba(255, 193, 7, 0.15)', zIndex: -1, borderRadius: '10px', width: '350px', height: '350px', top: '100px', left: '400px', animation: 'moveShape 25s linear infinite' } },
    { size: 'sm', pos: 's12', style: { position: 'fixed', background: 'rgba(255, 193, 7, 0.15)', zIndex: -1, borderRadius: '10px', width: '200px', height: '200px', bottom: '300px', right: '500px', animation: 'moveShape 25s linear infinite' } },
    { size: 'lg', pos: 's13', style: { position: 'fixed', background: 'rgba(255, 193, 7, 0.15)', zIndex: -1, borderRadius: '10px', width: '500px', height: '500px', top: '800px', right: '600px', animation: 'moveShape 25s linear infinite' } },
    { size: 'md', pos: 's14', style: { position: 'fixed', background: 'rgba(255, 193, 7, 0.15)', zIndex: -1, borderRadius: '10px', width: '350px', height: '350px', bottom: '1500px', left: '700px', animation: 'moveShape 25s linear infinite' } },
    { size: 'sm', pos: 's15', style: { position: 'fixed', background: 'rgba(255, 193, 7, 0.15)', zIndex: -1, borderRadius: '10px', width: '200px', height: '200px', top: '1600px', right: '200px', animation: 'moveShape 25s linear infinite' } }
  ];

  return (
    <>
      {shapes.map((shape, i) => (
        <div 
          key={i}
          style={shape.style}
        />
      ))}
    </>
  );
}
