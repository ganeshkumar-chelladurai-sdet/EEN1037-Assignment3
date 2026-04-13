function ProfileImage({ username, size = 100 }) {
  const imageUrl = `/api/profile/photo/?t=${new Date().getTime()}`

  return (
    <div style={{ 
      width: size, 
      height: size, 
      borderRadius: '50%', 
      overflow: 'hidden', 
      background: 'var(--glass-bg)',
      border: '2px solid var(--primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: size / 2.5,
      fontWeight: 'bold',
      color: 'var(--primary)'
    }}>
      <img
        src={imageUrl}
        alt={username}
        width={size}
        height={size}
        style={{ objectFit: 'cover', display: 'block' }}
        onError={(e) => { 
          e.target.style.display = 'none'
          e.target.parentElement.innerHTML = username ? username[0].toUpperCase() : '?'
        }}
      />
    </div>
  )
}

export default ProfileImage
