export const gym = {
  name: 'Áurea',
  city: 'Pinheiros, São Paulo',
  whatsapp: '5511999999999',
  images: {
    hero: 'https://images.pexels.com/photos/4065511/pexels-photo-4065511.jpeg?auto=compress&cs=tinysrgb&h=1400&w=2000',
    training: 'https://images.pexels.com/photos/13965872/pexels-photo-13965872.jpeg?auto=compress&cs=tinysrgb&h=1000&w=800',
    interior: 'https://images.pexels.com/photos/6739958/pexels-photo-6739958.jpeg?auto=compress&cs=tinysrgb&h=1000&w=1400',
    studio: 'https://images.pexels.com/photos/36833355/pexels-photo-36833355.jpeg?auto=compress&cs=tinysrgb&h=1000&w=1400',
    boxing: 'https://images.pexels.com/photos/4753993/pexels-photo-4753993.jpeg?auto=compress&cs=tinysrgb&h=900&w=700',
    coach: 'https://images.pexels.com/photos/12890804/pexels-photo-12890804.jpeg?auto=compress&cs=tinysrgb&h=900&w=700',
  },
  stats: [
    { value: '2.000+', label: 'alunos em movimento' },
    { value: '4,9', label: 'nota no Google' },
    { value: '06', label: 'anos de consistência' },
  ],
  plans: [
    { name: 'Mensal', price: 'R$ 289', period: '/mês', detail: 'flexibilidade para começar', features: ['Acesso livre à musculação', 'Avaliação inicial', 'App Áurea'], featured: false },
    { name: 'Trimestral', price: 'R$ 249', period: '/mês', detail: 'o ritmo que cria resultado', features: ['Tudo do Mensal', '2 aulas coletivas / semana', 'Reavaliação a cada 60 dias'], featured: true },
    { name: 'Anual', price: 'R$ 199', period: '/mês', detail: 'seu melhor investimento', features: ['Tudo do Trimestral', 'Aulas ilimitadas', 'Consultoria de treino'], featured: false },
  ],
  modalities: [
    { number: '01', name: 'Musculação', description: 'Força construída com método, acompanhamento e equipamento de precisão.', image: 'https://images.pexels.com/photos/9944900/pexels-photo-9944900.jpeg?auto=compress&cs=tinysrgb&h=1000&w=800' },
    { number: '02', name: 'Funcional', description: 'Movimento inteligente para viver com mais potência, mobilidade e presença.', image: 'https://images.pexels.com/photos/4761349/pexels-photo-4761349.jpeg?auto=compress&cs=tinysrgb&h=1000&w=800' },
    { number: '03', name: 'Boxe', description: 'Ritmo, coordenação e uma dose saudável de intensidade para sair do automático.', image: 'https://images.pexels.com/photos/38508793/pexels-photo-38508793.jpeg?auto=compress&cs=tinysrgb&h=1000&w=800' },
    { number: '04', name: 'Pilates', description: 'Consciência corporal e controle em uma experiência de baixa intensidade.', image: 'https://images.pexels.com/photos/36833355/pexels-photo-36833355.jpeg?auto=compress&cs=tinysrgb&h=1000&w=800' },
  ],
  testimonials: [
    { quote: 'Eu achava que academia não era para mim. Na Áurea, encontrei um lugar que respeita meu ritmo e me faz querer voltar.', name: 'Marina S.', detail: 'aluna há 14 meses' },
    { quote: 'O treino deixou de ser uma obrigação. Hoje é a hora do dia em que eu mais me encontro.', name: 'Rafael M.', detail: 'aluno há 2 anos' },
    { quote: 'A diferença está no cuidado. Todo mundo sabe seu nome, seu objetivo e o próximo passo.', name: 'Camila R.', detail: 'aluna há 8 meses' },
  ],
  faqs: [
    ['Preciso ter experiência?', 'Não. A Áurea recebe você no ponto em que está. A primeira avaliação e o acompanhamento inicial organizam o caminho com segurança.'],
    ['Como funciona a aula experimental?', 'Você escolhe o melhor horário, conhece o espaço e faz um treino acompanhado por um professor. Sem compromisso.'],
    ['Quais são os planos?', 'Temos opções mensal, trimestral e anual, com diferentes níveis de acesso e acompanhamento.'],
    ['Posso treinar todos os dias?', 'Sim. Seu plano dá acesso nos horários de funcionamento e nossa equipe orienta a melhor frequência para seu objetivo.'],
    ['Tem estacionamento?', 'Sim. Temos convênio com o estacionamento ao lado, com desconto exclusivo para alunos.'],
    ['Quais são os horários?', 'De segunda a sexta, das 6h às 23h. Aos sábados, das 8h às 14h.'],
    ['Quais modalidades estão disponíveis?', 'Musculação, funcional, boxe, pilates e sessões especiais de mobilidade.'],
    ['Preciso levar alguma coisa?', 'Venha com roupa confortável, uma garrafa de água e disposição. O resto a gente cuida.'],
    ['Como faço minha matrícula?', 'Fale com nosso time pelo WhatsApp ou visite a Áurea para conhecer os planos pessoalmente.'],
  ],
};

export type Modality = (typeof gym.modalities)[number];
