interface iOptions {
    id: number
    name?: string
}

interface iProps {
    options: iOptions[]
    selected?: number
    onChange: (value: number) => void
}

export const SelectInput: React.FC<iProps> = ({ options, selected, onChange }) => {
    return (
        <div className="control">
            <div className="select is-fullwidth">
                <select className="form-select" onChange={e => onChange(+e.target.value)}>
                    <option>Seleccionar</option>
                    {
                        options.map((option) => {
                            if (option.id === selected) {
                                return <option key={option.id} value={option.id} selected>{option.name}</option>
                            }

                            return <option key={option.id} value={option.id}>{option.name}</option>
                        })
                    }
                </select>
            </div>
        </div>
    )
}