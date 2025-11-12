import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  badge?: string;
}

interface CartItem extends Product {
  quantity: number;
}

const categories = ['Все', 'Электроника', 'Одежда', 'Дом', 'Спорт', 'Красота', 'Книги'];

const products: Product[] = [
  { id: 1, name: 'Смартфон Galaxy Pro', price: 45990, category: 'Электроника', image: '📱', badge: 'Хит' },
  { id: 2, name: 'Кроссовки NeoRun', price: 8990, category: 'Спорт', image: '👟', badge: 'Новинка' },
  { id: 3, name: 'Умные часы FitTrack', price: 12990, category: 'Электроника', image: '⌚' },
  { id: 4, name: 'Куртка Urban Style', price: 6990, category: 'Одежда', image: '🧥', badge: 'Скидка' },
  { id: 5, name: 'Кофемашина Barista', price: 24990, category: 'Дом', image: '☕' },
  { id: 6, name: 'Палетка теней Luxury', price: 2990, category: 'Красота', image: '💄', badge: 'Новинка' },
  { id: 7, name: 'Роман "Космос внутри"', price: 890, category: 'Книги', image: '📚' },
  { id: 8, name: 'Беспроводные наушники', price: 7990, category: 'Электроника', image: '🎧', badge: 'Хит' },
];

export default function Index() {
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeTab, setActiveTab] = useState('home');
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderData, setOrderData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    comment: '',
    delivery: 'courier',
    payment: 'card'
  });
  const { toast } = useToast();

  const filteredProducts = selectedCategory === 'Все' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + delta;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const calculateDelivery = () => {
    if (orderData.delivery === 'pickup') return 0;
    if (orderData.delivery === 'courier') {
      if (cartTotal >= 5000) return 0;
      return 300;
    }
    if (orderData.delivery === 'post') {
      if (cartTotal >= 5000) return 0;
      return 350;
    }
    return 0;
  };

  const deliveryCost = calculateDelivery();
  const finalTotal = cartTotal + deliveryCost;

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: 'Корзина пуста',
        description: 'Добавьте товары для оформления заказа',
        variant: 'destructive'
      });
      return;
    }
    setShowCheckout(true);
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderData.name || !orderData.phone || !orderData.address) {
      toast({
        title: 'Заполните обязательные поля',
        description: 'Имя, телефон и адрес обязательны для заказа',
        variant: 'destructive'
      });
      return;
    }
    const deliveryMethod = orderData.delivery === 'courier' ? 'Курьером' : orderData.delivery === 'pickup' ? 'Самовывоз' : 'Почта';
    const paymentMethod = orderData.payment === 'card' ? 'Картой онлайн' : orderData.payment === 'cash' ? 'Наличными' : 'Картой при получении';
    
    toast({
      title: '🎉 Заказ оформлен!',
      description: `Заказ на сумму ${finalTotal.toLocaleString()} ₽ принят. Доставка: ${deliveryMethod}. Оплата: ${paymentMethod}.`,
    });
    setCart([]);
    setShowCheckout(false);
    setOrderData({ name: '', phone: '', email: '', address: '', comment: '', delivery: 'courier', payment: 'card' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-purple-100 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-3xl">🛍️</div>
              <h1 className="font-display text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                УниМаг
              </h1>
            </div>
            
            <nav className="hidden md:flex items-center gap-6">
              <button onClick={() => setActiveTab('home')} className="text-sm font-medium hover:text-primary transition-colors">
                Главная
              </button>
              <button onClick={() => setActiveTab('catalog')} className="text-sm font-medium hover:text-primary transition-colors">
                Каталог
              </button>
              <button onClick={() => setActiveTab('about')} className="text-sm font-medium hover:text-primary transition-colors">
                О магазине
              </button>
              <button onClick={() => setActiveTab('delivery')} className="text-sm font-medium hover:text-primary transition-colors">
                Доставка
              </button>
              <button onClick={() => setActiveTab('contacts')} className="text-sm font-medium hover:text-primary transition-colors">
                Контакты
              </button>
            </nav>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <Icon name="ShoppingCart" size={20} />
                  {cartCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {cartCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-lg">
                <SheetHeader>
                  <SheetTitle className="font-display text-2xl">Корзина</SheetTitle>
                </SheetHeader>
                <div className="mt-8 space-y-4">
                  {cart.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <div className="text-5xl mb-4">🛒</div>
                      <p>Корзина пуста</p>
                    </div>
                  ) : (
                    <>
                      {cart.map(item => (
                        <Card key={item.id} className="overflow-hidden">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                              <div className="text-4xl">{item.image}</div>
                              <div className="flex-1">
                                <h3 className="font-semibold">{item.name}</h3>
                                <p className="text-sm text-muted-foreground">{item.price.toLocaleString()} ₽</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button size="icon" variant="outline" onClick={() => updateQuantity(item.id, -1)}>
                                  <Icon name="Minus" size={16} />
                                </Button>
                                <span className="w-8 text-center font-semibold">{item.quantity}</span>
                                <Button size="icon" variant="outline" onClick={() => updateQuantity(item.id, 1)}>
                                  <Icon name="Plus" size={16} />
                                </Button>
                              </div>
                              <Button size="icon" variant="ghost" onClick={() => removeFromCart(item.id)}>
                                <Icon name="Trash2" size={16} />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      {!showCheckout ? (
                        <div className="border-t pt-4 space-y-4">
                          <div className="flex items-center justify-between text-lg font-bold">
                            <span>Итого:</span>
                            <span className="text-primary">{cartTotal.toLocaleString()} ₽</span>
                          </div>
                          <Button className="w-full" size="lg" onClick={handleCheckout}>
                            Оформить заказ
                            <Icon name="ArrowRight" size={20} className="ml-2" />
                          </Button>
                        </div>
                      ) : (
                        <div className="border-t pt-4 space-y-4">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-display text-xl font-bold">Оформление заказа</h3>
                            <Button variant="ghost" size="sm" onClick={() => setShowCheckout(false)}>
                              <Icon name="ArrowLeft" size={16} className="mr-1" />
                              Назад
                            </Button>
                          </div>
                          
                          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-4 mb-4 space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Товары:</span>
                              <span className="font-semibold">{cartTotal.toLocaleString()} ₽</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Доставка:</span>
                              <span className="font-semibold">
                                {deliveryCost === 0 ? (
                                  <span className="text-green-600 flex items-center gap-1">
                                    <Icon name="Check" size={14} />
                                    Бесплатно
                                  </span>
                                ) : (
                                  `${deliveryCost.toLocaleString()} ₽`
                                )}
                              </span>
                            </div>
                            {cartTotal < 5000 && orderData.delivery !== 'pickup' && (
                              <div className="pt-2 border-t text-xs text-muted-foreground flex items-center gap-1">
                                <Icon name="Info" size={12} />
                                <span>Бесплатная доставка от 5000 ₽</span>
                              </div>
                            )}
                            <div className="flex items-center justify-between pt-2 border-t">
                              <span className="font-bold">Итого:</span>
                              <span className="text-primary text-xl font-bold">{finalTotal.toLocaleString()} ₽</span>
                            </div>
                          </div>

                          <form onSubmit={handleSubmitOrder} className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="name">Имя <span className="text-destructive">*</span></Label>
                              <Input
                                id="name"
                                placeholder="Иван Иванов"
                                value={orderData.name}
                                onChange={(e) => setOrderData({...orderData, name: e.target.value})}
                                required
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="phone">Телефон <span className="text-destructive">*</span></Label>
                              <Input
                                id="phone"
                                type="tel"
                                placeholder="+7 (999) 123-45-67"
                                value={orderData.phone}
                                onChange={(e) => setOrderData({...orderData, phone: e.target.value})}
                                required
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="email">Email</Label>
                              <Input
                                id="email"
                                type="email"
                                placeholder="ivan@example.com"
                                value={orderData.email}
                                onChange={(e) => setOrderData({...orderData, email: e.target.value})}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>Способ доставки <span className="text-destructive">*</span></Label>
                              <RadioGroup value={orderData.delivery} onValueChange={(value) => setOrderData({...orderData, delivery: value})}>
                                <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-accent/50 transition-colors cursor-pointer">
                                  <RadioGroupItem value="courier" id="courier" />
                                  <Label htmlFor="courier" className="flex-1 cursor-pointer">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <span className="text-lg">🚚</span>
                                        <div>
                                          <div className="font-semibold">Курьером</div>
                                          <div className="text-xs text-muted-foreground">1-2 дня</div>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        {cartTotal >= 5000 ? (
                                          <Badge variant="secondary" className="bg-green-100 text-green-700">Бесплатно</Badge>
                                        ) : (
                                          <span className="font-semibold">300 ₽</span>
                                        )}
                                      </div>
                                    </div>
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-accent/50 transition-colors cursor-pointer">
                                  <RadioGroupItem value="pickup" id="pickup" />
                                  <Label htmlFor="pickup" className="flex-1 cursor-pointer">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <span className="text-lg">🏪</span>
                                        <div>
                                          <div className="font-semibold">Самовывоз</div>
                                          <div className="text-xs text-muted-foreground">Сегодня</div>
                                        </div>
                                      </div>
                                      <Badge variant="secondary" className="bg-green-100 text-green-700">Бесплатно</Badge>
                                    </div>
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-accent/50 transition-colors cursor-pointer">
                                  <RadioGroupItem value="post" id="post" />
                                  <Label htmlFor="post" className="flex-1 cursor-pointer">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <span className="text-lg">📦</span>
                                        <div>
                                          <div className="font-semibold">Почта России</div>
                                          <div className="text-xs text-muted-foreground">3-7 дней</div>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        {cartTotal >= 5000 ? (
                                          <Badge variant="secondary" className="bg-green-100 text-green-700">Бесплатно</Badge>
                                        ) : (
                                          <span className="font-semibold">350 ₽</span>
                                        )}
                                      </div>
                                    </div>
                                  </Label>
                                </div>
                              </RadioGroup>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="address">Адрес доставки <span className="text-destructive">*</span></Label>
                              <Textarea
                                id="address"
                                placeholder="Город, улица, дом, квартира"
                                value={orderData.address}
                                onChange={(e) => setOrderData({...orderData, address: e.target.value})}
                                rows={3}
                                required
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>Способ оплаты <span className="text-destructive">*</span></Label>
                              <RadioGroup value={orderData.payment} onValueChange={(value) => setOrderData({...orderData, payment: value})}>
                                <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-accent/50 transition-colors cursor-pointer">
                                  <RadioGroupItem value="card" id="card" />
                                  <Label htmlFor="card" className="flex-1 cursor-pointer">
                                    <div className="flex items-center gap-2">
                                      <span className="text-lg">💳</span>
                                      <div>
                                        <div className="font-semibold">Картой онлайн</div>
                                        <div className="text-xs text-muted-foreground">Visa, MasterCard, МИР</div>
                                      </div>
                                    </div>
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-accent/50 transition-colors cursor-pointer">
                                  <RadioGroupItem value="cash" id="cash" />
                                  <Label htmlFor="cash" className="flex-1 cursor-pointer">
                                    <div className="flex items-center gap-2">
                                      <span className="text-lg">💵</span>
                                      <div>
                                        <div className="font-semibold">Наличными</div>
                                        <div className="text-xs text-muted-foreground">При получении курьеру</div>
                                      </div>
                                    </div>
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-accent/50 transition-colors cursor-pointer">
                                  <RadioGroupItem value="card-on-delivery" id="card-on-delivery" />
                                  <Label htmlFor="card-on-delivery" className="flex-1 cursor-pointer">
                                    <div className="flex items-center gap-2">
                                      <span className="text-lg">💳</span>
                                      <div>
                                        <div className="font-semibold">Картой при получении</div>
                                        <div className="text-xs text-muted-foreground">Терминал у курьера</div>
                                      </div>
                                    </div>
                                  </Label>
                                </div>
                              </RadioGroup>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="comment">Комментарий к заказу</Label>
                              <Textarea
                                id="comment"
                                placeholder="Пожелания к заказу или доставке"
                                value={orderData.comment}
                                onChange={(e) => setOrderData({...orderData, comment: e.target.value})}
                                rows={2}
                              />
                            </div>

                            <Button type="submit" className="w-full" size="lg">
                              <Icon name="CheckCircle" size={20} className="mr-2" />
                              Подтвердить заказ
                            </Button>
                          </form>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="home" className="space-y-12 animate-fade-in">
            <section className="text-center py-20 animate-scale-in">
              <div className="inline-block text-8xl mb-6 animate-pulse">🎁</div>
              <h2 className="font-display text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Всё что можно
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Универсальный магазин с огромным выбором товаров для любых потребностей
              </p>
              <Button size="lg" className="text-lg px-8" onClick={() => setActiveTab('catalog')}>
                Перейти в каталог
                <Icon name="ArrowRight" size={24} className="ml-2" />
              </Button>
            </section>

            <section>
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-display text-3xl font-bold">Популярные товары</h3>
                <Button variant="ghost" onClick={() => setActiveTab('catalog')}>
                  Смотреть все
                  <Icon name="ChevronRight" size={20} className="ml-1" />
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.slice(0, 4).map((product, idx) => (
                  <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
                    <CardContent className="p-6">
                      <div className="relative">
                        {product.badge && (
                          <Badge className="absolute top-0 right-0 z-10">{product.badge}</Badge>
                        )}
                        <div className="text-6xl mb-4 text-center">{product.image}</div>
                      </div>
                      <h4 className="font-semibold mb-2 text-lg">{product.name}</h4>
                      <p className="text-sm text-muted-foreground mb-4">{product.category}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary">{product.price.toLocaleString()} ₽</span>
                        <Button size="icon" onClick={() => addToCart(product)} className="rounded-full">
                          <Icon name="ShoppingCart" size={20} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section className="grid md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
                <CardContent className="p-6 text-center">
                  <div className="text-5xl mb-4">🚚</div>
                  <h4 className="font-display font-bold text-xl mb-2">Быстрая доставка</h4>
                  <p className="text-muted-foreground">Доставим за 1-3 дня по всей стране</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-secondary/10 to-accent/10 border-secondary/20">
                <CardContent className="p-6 text-center">
                  <div className="text-5xl mb-4">💳</div>
                  <h4 className="font-display font-bold text-xl mb-2">Удобная оплата</h4>
                  <p className="text-muted-foreground">Оплата картой, наличными или онлайн</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-accent/10 to-primary/10 border-accent/20">
                <CardContent className="p-6 text-center">
                  <div className="text-5xl mb-4">🎯</div>
                  <h4 className="font-display font-bold text-xl mb-2">Гарантия качества</h4>
                  <p className="text-muted-foreground">Возврат в течение 14 дней</p>
                </CardContent>
              </Card>
            </section>
          </TabsContent>

          <TabsContent value="catalog" className="animate-fade-in">
            <div className="space-y-8">
              <div>
                <h2 className="font-display text-4xl font-bold mb-6">Каталог товаров</h2>
                <div className="flex flex-wrap gap-3">
                  {categories.map(cat => (
                    <Button
                      key={cat}
                      variant={selectedCategory === cat ? 'default' : 'outline'}
                      onClick={() => setSelectedCategory(cat)}
                      className="rounded-full"
                    >
                      {cat}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product, idx) => (
                  <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in" style={{ animationDelay: `${idx * 50}ms` }}>
                    <CardContent className="p-6">
                      <div className="relative">
                        {product.badge && (
                          <Badge className="absolute top-0 right-0 z-10">{product.badge}</Badge>
                        )}
                        <div className="text-6xl mb-4 text-center">{product.image}</div>
                      </div>
                      <h4 className="font-semibold mb-2 text-lg">{product.name}</h4>
                      <p className="text-sm text-muted-foreground mb-4">{product.category}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary">{product.price.toLocaleString()} ₽</span>
                        <Button size="icon" onClick={() => addToCart(product)} className="rounded-full">
                          <Icon name="ShoppingCart" size={20} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="about" className="animate-fade-in">
            <div className="max-w-3xl mx-auto space-y-6">
              <h2 className="font-display text-4xl font-bold mb-6">О магазине</h2>
              <Card>
                <CardContent className="p-8 space-y-4">
                  <p className="text-lg">
                    <strong className="text-primary">УниМаг</strong> — это современный интернет-магазин, где можно найти всё что нужно. 
                    От электроники до одежды, от товаров для дома до спортивного снаряжения.
                  </p>
                  <p>
                    Мы работаем с проверенными поставщиками и гарантируем качество каждого товара. 
                    Наша миссия — сделать покупки простыми, быстрыми и приятными.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 pt-4">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">✨</div>
                      <div>
                        <h4 className="font-semibold mb-1">Широкий выбор</h4>
                        <p className="text-sm text-muted-foreground">Тысячи товаров в разных категориях</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">🔒</div>
                      <div>
                        <h4 className="font-semibold mb-1">Безопасность</h4>
                        <p className="text-sm text-muted-foreground">Защищенные платежи и данные</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">⚡</div>
                      <div>
                        <h4 className="font-semibold mb-1">Быстрая доставка</h4>
                        <p className="text-sm text-muted-foreground">Отправка в день заказа</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">💬</div>
                      <div>
                        <h4 className="font-semibold mb-1">Поддержка 24/7</h4>
                        <p className="text-sm text-muted-foreground">Всегда готовы помочь</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="delivery" className="animate-fade-in">
            <div className="max-w-3xl mx-auto space-y-6">
              <h2 className="font-display text-4xl font-bold mb-6">Доставка и оплата</h2>
              
              <Card>
                <CardContent className="p-8 space-y-6">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="text-3xl">🚚</div>
                      <h3 className="font-display text-2xl font-bold">Доставка</h3>
                    </div>
                    <div className="space-y-3 text-muted-foreground">
                      <p><strong className="text-foreground">Курьером по городу:</strong> 300 ₽, доставка на следующий день</p>
                      <p><strong className="text-foreground">Почта России:</strong> от 350 ₽, 3-7 дней</p>
                      <p><strong className="text-foreground">СДЭК:</strong> от 400 ₽, 2-5 дней</p>
                      <p><strong className="text-foreground">Бесплатная доставка:</strong> при заказе от 5000 ₽</p>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="text-3xl">💳</div>
                      <h3 className="font-display text-2xl font-bold">Оплата</h3>
                    </div>
                    <div className="space-y-3 text-muted-foreground">
                      <p><strong className="text-foreground">Онлайн-оплата:</strong> картами Visa, MasterCard, МИР</p>
                      <p><strong className="text-foreground">При получении:</strong> наличными или картой курьеру</p>
                      <p><strong className="text-foreground">Безопасность:</strong> все платежи защищены SSL-шифрованием</p>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="text-3xl">↩️</div>
                      <h3 className="font-display text-2xl font-bold">Возврат</h3>
                    </div>
                    <p className="text-muted-foreground">
                      Вы можете вернуть товар в течение 14 дней с момента получения, если он не подошел. 
                      Возврат денег осуществляется в течение 3-5 рабочих дней.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="contacts" className="animate-fade-in">
            <div className="max-w-3xl mx-auto space-y-6">
              <h2 className="font-display text-4xl font-bold mb-6">Контакты</h2>
              
              <Card>
                <CardContent className="p-8 space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Icon name="Phone" size={24} className="text-primary mt-1" />
                        <div>
                          <h4 className="font-semibold mb-1">Телефон</h4>
                          <p className="text-muted-foreground">+7 (495) 123-45-67</p>
                          <p className="text-sm text-muted-foreground">Ежедневно с 9:00 до 21:00</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Icon name="Mail" size={24} className="text-primary mt-1" />
                        <div>
                          <h4 className="font-semibold mb-1">Email</h4>
                          <p className="text-muted-foreground">info@unimag.ru</p>
                          <p className="text-sm text-muted-foreground">Ответим в течение 24 часов</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Icon name="MapPin" size={24} className="text-primary mt-1" />
                        <div>
                          <h4 className="font-semibold mb-1">Адрес</h4>
                          <p className="text-muted-foreground">г. Москва, ул. Примерная, д. 1</p>
                          <p className="text-sm text-muted-foreground">Пн-Пт: 10:00-20:00, Сб-Вс: 11:00-19:00</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Icon name="MessageCircle" size={24} className="text-primary mt-1" />
                        <div>
                          <h4 className="font-semibold mb-1">Соцсети</h4>
                          <div className="flex gap-2 mt-2">
                            <Button size="icon" variant="outline">
                              <span>VK</span>
                            </Button>
                            <Button size="icon" variant="outline">
                              <span>TG</span>
                            </Button>
                            <Button size="icon" variant="outline">
                              <span>IG</span>
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-4">
                        <h4 className="font-semibold mb-2">Есть вопросы?</h4>
                        <p className="text-sm text-muted-foreground mb-3">Напишите нам, и мы обязательно поможем!</p>
                        <Button className="w-full">
                          <Icon name="Send" size={18} className="mr-2" />
                          Написать в поддержку
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="bg-white border-t border-purple-100 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="text-2xl">🛍️</div>
              <span className="font-display font-bold text-lg">УниМаг</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2024 Универсальный магазин. Всё что можно.</p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <button className="hover:text-primary transition-colors">Политика конфиденциальности</button>
              <button className="hover:text-primary transition-colors">Условия использования</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}