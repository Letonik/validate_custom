import React, {useEffect, useMemo, useState} from "react";
import './App.css';

const useValidation = (value, validations) => {

  const [isEmpty, setEmpty] = useState(true)
  const [minLengthError, setMinLengthError] = useState(false)
  const [emailError, setEmailError] = useState(false)
  const [textError, setTextError] = useState('Поле не может быть пустым')

  const isError = useMemo(() => {
    return (isEmpty || minLengthError || emailError) ? true : false
  }, [isEmpty, minLengthError, emailError])

  useEffect(() => {
    for (const validation in validations) {
      switch (validation) {
        case 'isEmpty':
          if (value) {
            setEmpty(false)
          } else {
            setEmpty(true)
            setTextError(`Поле не может быть пустым`)
          }
          break
        case 'minLength':
          if (value.length < validations[validation]) {
            setMinLengthError (true)
            setTextError(`Минимальная длина ${validations[validation]} символа`)
          } else {
            setMinLengthError (false)
          }
          break
        case 'isEmail':
          const regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          if (regexEmail.test(value.toLowerCase())) {
            setEmailError(false)
          } else {
            setEmailError(true)
            setTextError(`Некорректный email`)
          }
          break
      }
    }
  }, [value])
  return {
    isError,
    textError
  }
}

const useInput = (initialValue, validations) => {
  const [value, setValue] = useState(initialValue)
  const [isDirty, setDirty] = useState(false)
  const valid = useValidation(value, validations)

  const onChange = (e) => {
    setValue(e.target.value)
  }
  const onBlur = (e) => {
    setDirty(true)
  }
  return {
    value,
    onChange,
    onBlur,
    isDirty,
    ...valid
  }
}

function App() {
  const email = useInput('', {isEmail: true, minLength: 5, isEmpty: true}) //Очередность справа налево
  const phone = useInput('', {minLength: 5, isEmpty: true}) // то есть первой отработает правая ошибка
  const fullName = useInput('', {isEmpty: true})

  return (
    <div className="app">
      <form>
        <h1>Some Form</h1>
        {(email.isDirty && email.isError) && <div style={{color: 'red'}}>{email.textError}</div>}
        <input
          name='email' type="text"
          placeholder='Email'
          value={email.value}
          onChange={e => email.onChange(e)}
          onBlur={e => email.onBlur(e)}
        />
        {(phone.isDirty && phone.isError) && <div style={{color: 'red'}}>{phone.textError}</div>}
        <input
          name='phone' type="text"
          placeholder='Phone'
          value={phone.value}
          onChange={e => phone.onChange(e)}
          onBlur={e => phone.onBlur(e)}
        />
        {(fullName.isDirty && fullName.isError) && <div style={{color: 'red'}}>{fullName.textError}</div>}
        <input
          name='fullName' type="text"
          placeholder='Full Name'
          value={fullName.value}
          onChange={e => fullName.onChange(e)}
          onBlur={e => fullName.onBlur(e)}
        />
        <button
          type='submit'
          disabled={email.isError || phone.isError || fullName.isError}
        >
          Ok
        </button>
      </form>
    </div>
  );
}

export default App;
