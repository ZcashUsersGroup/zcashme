import { useState, useEffect } from 'react'
import './index.css'
import { getRandomZcasher, getTotalCount, getZcasher } from './selectRandom'
import { useParams, useNavigate } from 'react-router-dom'
import QRModal from './QRModal'

// magnifying glass icon svg
function MagnifyingGlassIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
        </svg>
    )
}

// github icon svg
function GithubIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
            <path fillRule="evenodd" d="M12 .5C5.73.5.99 5.24.99 11.51c0 4.86 3.16 8.98 7.54 10.43.55.1.75-.24.75-.53 0-.26-.01-1.14-.02-2.06-3.07.67-3.72-1.31-3.72-1.31-.5-1.27-1.22-1.6-1.22-1.6-.99-.67.08-.66.08-.66 1.09.08 1.66 1.12 1.66 1.12.98 1.67 2.57 1.19 3.2.91.1-.71.38-1.19.69-1.47-2.45-.28-5.02-1.23-5.02-5.47 0-1.21.43-2.19 1.12-2.97-.11-.28-.49-1.42.11-2.96 0 0 .92-.3 3.02 1.13.88-.24 1.83-.36 2.77-.36.94 0 1.89.12 2.77.36 2.1-1.43 3.02-1.13 3.02-1.13.6 1.54.22 2.68.11 2.96.69.78 1.12 1.76 1.12 2.97 0 4.25-2.58 5.19-5.03 5.46.39.34.73 1.01.73 2.04 0 1.47-.01 2.66-.01 3.02 0 .29.19.64.75.53 4.38-1.45 7.54-5.56 7.54-10.42C23.01 5.24 18.27.5 12 .5z" clipRule="evenodd"/>
        </svg>
    )
}

// copy icon svg
function CopyIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
    )
}

function ContentBox({ children, className = "" }) {
    return (
        <div className={`w-[280px] h-[280px] border-8 border-primary/60 bg-background rounded-lg flex items-center justify-center ${className}`}>
            {children}
        </div>
    )
}

function ZcashProfile() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [name, setName] = useState('Akbar Khamidov')
    const [address, setAddress] = useState('zs1q6t5r3r9908n3ehg0frxgkzhp')
    const [sinceYear, setSinceYear] = useState('YYYY')
    const [lastSigned, setLastSigned] = useState('<N')
    const [count, setCount] = useState(0)
    const [randomZcasher, setRandomZcasher] = useState(null)

    useEffect(() => {
        const initializeApp = async () => {
            const totalCount = await getTotalCount()
            setCount(totalCount)

            if(id) {
                const zcasher = await getZcasher(id)
                if(zcasher) {
                    setRandomZcasher(zcasher)
                    setName(zcasher.name || 'Unknown')
                    setAddress(zcasher.address || 'Unknown')
                    const year = new Date(zcasher.claimed_at).getFullYear()
                    setSinceYear(year || 'Unknown')
                    setLastSigned(zcasher.last_signed_at || 'Unknown')
                    console.log(zcasher)
                    console.log(name)
                    console.log(address)
                    console.log(sinceYear)
                    console.log(lastSigned)
                }
            } else {
                // first time loading
                const randomZcasher = await getRandomZcasher(totalCount)
                if(randomZcasher) {
                    setRandomZcasher(randomZcasher)
                    setName(randomZcasher.name || 'Unknown')
                    setAddress(randomZcasher.address || 'Unknown')
                    const year = new Date(randomZcasher.claimed_at).getFullYear()
                    setSinceYear(year || 'Unknown')
                    setLastSigned(randomZcasher.last_signed_at || 'Unknown')
                    console.log(randomZcasher)
                    console.log(name)
                    console.log(address)
                    console.log(sinceYear)
                    console.log(lastSigned)
                } else {
                    console.log("No random zcasher found")
                }
            }

        }
            
        initializeApp()
    }, [id])

    async function randomize(count) {
        const randomZcasher = await getRandomZcasher(count)
        setRandomZcasher(randomZcasher)
        if(randomZcasher) {
            navigate(`/${randomZcasher.id}`)
        }
    }

    async function copyAddress() {
        try {
            await navigator.clipboard.writeText(address)
            alert("copied")
        } catch (err) {
            console.error('Failed to copy address:', err)
        }
    }

    // qr code content box hard code
    const contentBoxContent = (
        <div className="text-center p-4">
            <QRModal address={address} />
        </div>
    )

  return (
    <div className="min-h-screen bg-background text-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card rounded-3xl shadow-xl border-8 border-primary/60 p-6 relative">
        {/* header */}
        <div className="flex items-center justify-between border-b-4 border-primary/60 pb-4 mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight">zcash.me/</h1>
          <button className="flex items-center justify-left w-40 h-12 bg-background border-4 border-primary/60 rounded-full text-primary/70 hover:text-primary transition-colors">
            <MagnifyingGlassIcon className="w-5 h-5 ml-3" />
          </button>
        </div>

        {/* name */}
        <h2 className="text-center text-3xl font-extrabold mb-6">{name}</h2>

        {/* qr box */}
        <div className="flex justify-center mb-6">
          <ContentBox>
            {contentBoxContent}
          </ContentBox>
        </div>

        {/* profile stuff */}
        <div className="flex justify-between items-start mb-4">
          <div className="text-left">
            <div className="text-lg font-bold mb-2">Since {sinceYear}</div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full border-4 border-primary/60 flex items-center justify-center font-extrabold text-sm"> 
                {/* button 1*/}
              </div>
              <div className="w-8 h-8 rounded-full border-4 border-primary/60 flex items-center justify-center">
                {/* button 2*/} 
              </div>
              <div className="w-8 h-8 rounded-full border-4 border-primary/60 flex items-center justify-center">
                {/* button 3*/}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold">Last signed</div>
            <div className="text-lg font-bold">{lastSigned} Weeks</div>
          </div>
        </div>

        {/* address */}
        <div className="space-y-4">
          <div className="flex items-stretch gap-2">
            <div className="flex-1 rounded-2xl border-4 border-primary/60 px-4 py-3 text-sm bg-background overflow-hidden">
              <span className="font-mono">{address}</span>
            </div>
            <button 
              onClick={copyAddress} 
              className="rounded-2xl border-4 border-primary/60 px-4 py-3 font-bold hover:bg-primary/10 transition-colors flex items-center justify-center"
              aria-label="Copy address"
            >
              <CopyIcon className="w-5 h-5" />
            </button>
          </div>

          {/* random */}
          <button 
            onClick={() => randomize(count)} 
            className="w-full rounded-2xl border-4 border-primary/60 py-3 text-lg font-extrabold hover:bg-primary/10 transition-colors"
          >
            Show another random Zcasher
          </button>
        </div>

        {/* footer */}
        <div className="mt-6 border-t-4 border-primary/60 pt-4 flex justify-center">
          <a href="#" className="text-primary hover:text-primary/80 transition-colors" aria-label="GitHub">
            <GithubIcon className="w-8 h-8" />
          </a>
        </div>
      </div>
    </div>
  )
}

export default ZcashProfile
