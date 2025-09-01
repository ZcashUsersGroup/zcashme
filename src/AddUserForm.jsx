import { useState } from 'react'
import { supabase } from './supabase.js'

// Plus icon svg
function PlusIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
    )
}

// X icon svg
function XIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    )
}

function AddUserForm({ isOpen, onClose, onUserAdded }) {
    const [name, setName] = useState('')
    const [address, setAddress] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        try {
            const { data, error } = await supabase
                .from('zcasher')
                .insert([
                    {
                        name: name.trim(),
                        address: address.trim(),
                    }
                ])
                .select()

            if (error) {
                throw error
            }

            // Reset form
            setName('')
            setAddress('')
            onUserAdded(data[0])
            onClose()
        } catch (err) {
            setError(err.message || 'Failed to add user')
        } finally {
            setIsLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-card rounded-3xl shadow-xl border-8 border-primary/60 p-6 w-full max-w-md">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-extrabold">Add New Zcasher</h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full border-4 border-primary/60 flex items-center justify-center hover:bg-primary/10 transition-colors"
                    >
                        <XIcon className="w-4 h-4" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-bold mb-2">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-2xl border-4 border-primary/60 px-4 py-3 text-sm bg-background focus:outline-none focus:border-primary"
                            placeholder="Enter name"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="address" className="block text-sm font-bold mb-2">
                            Zcash Address
                        </label>
                        <input
                            type="text"
                            id="address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full rounded-2xl border-4 border-primary/60 px-4 py-3 text-sm bg-background focus:outline-none focus:border-primary font-mono"
                            placeholder="zs1..."
                            required
                        />
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm font-bold">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-2xl border-4 border-primary/60 py-3 text-lg font-extrabold hover:bg-primary/10 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 rounded-2xl border-4 border-primary/60 py-3 text-lg font-extrabold hover:bg-primary/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? 'Adding...' : 'Add User'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddUserForm
