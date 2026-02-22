import React from 'react'

function page() {
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [username, setUsername] = React.useState('')
    const handleSignin = (e: React.FormEvent) => {
        e.preventDefault()
        console.log(email, password, username)
    }
    return (
        <div>
            <div>signup</div>
            <form action="" onSubmit={handleSignin}>
                <input type="text" placeholder='username' value={username} onChange={(e) => setUsername(e.target.value)} />
                <input type="text" placeholder='email' value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">signup</button>
            </form>
        </div>
    )
}

export default page