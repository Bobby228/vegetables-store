import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderWithMantine } from './test-utils'
import CardElem from "../components/Card/CardElem.tsx";

const addToCartMock = vi.fn()

vi.mock('../components/Cart/CartContext.tsx', () => ({
  useCart: () => ({
    addToCart: addToCartMock,
  }),
}))

describe('CardElem', () => {
  const props = {
    id: 1,
    name: 'Apple-1kg',
    price: 10,
    image: 'test.jpg',
  }

  beforeEach(() => {
    addToCartMock.mockClear()
  })

  it('рендерит название и цену', () => {
    renderWithMantine(<CardElem {...props} />)

    expect(screen.getByText(/Apple/i)).toBeInTheDocument()
    expect(screen.getByText('$10')).toBeInTheDocument()
  })

  it('увеличивает количество по клику на "+"', async () => {
    const user = userEvent.setup()

    renderWithMantine(<CardElem {...props} />)

    const plusButton = screen.getByText('+')

    await user.click(plusButton)
    await user.click(plusButton)

    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('уменьшает количество по клику на "-"', async () => {
    const user = userEvent.setup()

    renderWithMantine(<CardElem {...props} />)

    const plusButton = screen.getByText('+')
    const minusButton = screen.getByText('-')

    await user.click(plusButton)
    await user.click(plusButton)
    await user.click(minusButton)

    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('не позволяет уйти в отрицательное значение', async () => {
    const user = userEvent.setup()

    renderWithMantine(<CardElem {...props} />)

    const minusButton = screen.getByText('-')

    await user.click(minusButton)
    await user.click(minusButton)

    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('вызывает addToCart с правильными данными', async () => {
    const user = userEvent.setup()

    renderWithMantine(<CardElem {...props} />)

    await user.click(screen.getByText('+'))
    await user.click(screen.getByRole('button', { name: /add to cart/i }))

    expect(addToCartMock).toHaveBeenCalledTimes(1)
    expect(addToCartMock).toHaveBeenCalledWith(props, 1)
  })

  it('сбрасывает счетчик после добавления в корзину', async () => {
    const user = userEvent.setup()

    renderWithMantine(<CardElem {...props} />)

    await user.click(screen.getByText('+'))
    await user.click(screen.getByRole('button', { name: /add to cart/i }))

    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('не вызывает addToCart если количество 0', async () => {
    const user = userEvent.setup()

    renderWithMantine(<CardElem {...props} />)

    await user.click(screen.getByRole('button', { name: /add to cart/i }))

    expect(addToCartMock).not.toHaveBeenCalled()
  })
})