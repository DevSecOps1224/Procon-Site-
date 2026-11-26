const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');

menuToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
  menuToggle.textContent = isOpen ? '×' : '☰';
});

mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menu');
    menuToggle.textContent = '☰';
  });
});

document.getElementById('printChecklist').addEventListener('click', () => window.print());

const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 500);
});
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

const questions = [
  {
    question: 'Qual lei é conhecida como Código de Defesa do Consumidor no Brasil?',
    answers: ['Lei nº 8.078/1990', 'Lei nº 9.099/1995', 'Lei nº 10.406/2002', 'Lei nº 12.527/2011'],
    correct: 0,
    explanation: 'A Lei nº 8.078, de 11 de setembro de 1990, instituiu o Código de Defesa do Consumidor (CDC).'
  },
  {
    question: 'Qual destas opções é um direito básico do consumidor previsto no CDC?',
    answers: ['Receber informação adequada e clara', 'Ter qualquer produto gratuitamente', 'Cancelar toda compra presencial em até 7 dias', 'Exigir desconto em qualquer compra'],
    correct: 0,
    explanation: 'O artigo 6º do CDC prevê o direito à informação adequada e clara sobre produtos e serviços.'
  },
  {
    question: 'Em regra, qual é o prazo para reclamar de vício aparente em produto ou serviço não durável?',
    answers: ['7 dias', '15 dias', '30 dias', '90 dias'],
    correct: 2,
    explanation: 'O artigo 26 do CDC estabelece prazo de 30 dias para produtos e serviços não duráveis.'
  },
  {
    question: 'Em regra, qual é o prazo para reclamar de vício aparente em produto ou serviço durável?',
    answers: ['30 dias', '60 dias', '90 dias', '180 dias'],
    correct: 2,
    explanation: 'O artigo 26 do CDC estabelece prazo de 90 dias para produtos e serviços duráveis.'
  },
  {
    question: 'Em compras realizadas pela internet, telefone ou fora do estabelecimento comercial, qual é o prazo legal de arrependimento previsto no CDC?',
    answers: ['Até 2 dias', 'Até 5 dias', 'Até 7 dias', 'Até 30 dias'],
    correct: 2,
    explanation: 'O artigo 49 do CDC prevê o prazo de 7 dias, contado da assinatura ou do recebimento do produto ou serviço, conforme o caso.'
  },
  {
    question: 'O que deve fazer o fornecedor ao apresentar a oferta de um produto ou serviço?',
    answers: ['Informar características e preço de forma clara', 'Omitir condições que possam reduzir as vendas', 'Informar somente o preço final, sem detalhes', 'Alterar livremente a oferta depois da contratação'],
    correct: 0,
    explanation: 'O consumidor tem direito a informações claras e precisas. A oferta suficientemente precisa pode vincular o fornecedor, conforme o CDC.'
  },
  {
    question: 'Quando um consumidor recebe uma cobrança indevida e já pagou o valor, o CDC prevê, em determinadas condições:',
    answers: ['Apenas um pedido de desculpas', 'Devolução em dobro do valor pago em excesso, com correção e juros, salvo hipótese de engano justificável', 'Perda automática do direito de reclamar', 'Devolução obrigatória em triplo'],
    correct: 1,
    explanation: 'O artigo 42, parágrafo único, prevê repetição do indébito em dobro, salvo hipótese de engano justificável.'
  },
  {
    question: 'O prazo de arrependimento de 7 dias do CDC se aplica, em regra, a:',
    answers: ['Toda compra feita presencialmente', 'Compras realizadas fora do estabelecimento comercial', 'Somente compras de alimentos', 'Somente produtos usados'],
    correct: 1,
    explanation: 'O artigo 49 trata de contratações realizadas fora do estabelecimento comercial, especialmente por telefone ou a domicílio; a regra também alcança compras pela internet.'
  },
  {
    question: 'Qual documento pode ajudar a comprovar uma compra ao apresentar uma reclamação?',
    answers: ['Nota fiscal ou comprovante de compra', 'Somente documento de identidade de uma testemunha', 'Uma fotografia aleatória', 'Nenhum documento é útil'],
    correct: 0,
    explanation: 'A nota fiscal ou outro comprovante ajuda a demonstrar a relação de consumo. Contratos, protocolos e conversas também podem ser úteis conforme o caso.'
  },
  {
    question: 'Qual é uma das funções do PROCON?',
    answers: ['Substituir todos os tribunais', 'Orientar consumidores e atuar na proteção e defesa dos direitos do consumidor', 'Definir os preços de todos os produtos', 'Garantir que toda reclamação resulte em indenização'],
    correct: 1,
    explanation: 'O PROCON integra o sistema de defesa do consumidor e atua na orientação, proteção e defesa dos direitos previstos na legislação.'
  }
];

let currentQuestion = 0;
let score = 0;
let answered = false;

const questionText = document.getElementById('questionText');
const questionTag = document.getElementById('questionTag');
const answersContainer = document.getElementById('answers');
const feedback = document.getElementById('quizFeedback');
const nextButton = document.getElementById('nextQuestion');
const statusText = document.getElementById('answerStatus');
const questionCounter = document.getElementById('questionCounter');
const progressFill = document.getElementById('progressFill');
const quizContent = document.getElementById('quizContent');
const quizResult = document.getElementById('quizResult');

function renderQuestion() {
  const item = questions[currentQuestion];
  answered = false;
  questionText.textContent = item.question;
  questionTag.textContent = `PERGUNTA ${String(currentQuestion + 1).padStart(2, '0')}`;
  questionCounter.textContent = `Pergunta ${currentQuestion + 1} de ${questions.length}`;
  progressFill.style.width = `${(currentQuestion / questions.length) * 100}%`;
  answersContainer.innerHTML = '';
  feedback.textContent = '';
  feedback.className = 'quiz-feedback';
  statusText.textContent = 'Selecione uma alternativa.';
  nextButton.disabled = true;
  nextButton.textContent = currentQuestion === questions.length - 1 ? 'Ver resultado →' : 'Próxima pergunta →';

  item.answers.forEach((answer, index) => {
    const button = document.createElement('button');
    button.className = 'answer-option';
    button.type = 'button';
    button.innerHTML = `<span class="option-letter">${String.fromCharCode(65 + index)}</span><span></span>`;
    button.querySelector('span:last-child').textContent = answer;
    button.addEventListener('click', () => chooseAnswer(index));
    answersContainer.appendChild(button);
  });
}

function chooseAnswer(selectedIndex) {
  if (answered) return;
  answered = true;
  const item = questions[currentQuestion];
  const options = [...answersContainer.querySelectorAll('.answer-option')];
  options.forEach((option, index) => {
    option.disabled = true;
    if (index === item.correct) option.classList.add('correct');
    if (index === selectedIndex && index !== item.correct) option.classList.add('incorrect');
    if (index === selectedIndex) option.classList.add('selected');
  });

  const isCorrect = selectedIndex === item.correct;
  if (isCorrect) score++;
  feedback.textContent = `${isCorrect ? 'Muito bem! ' : 'Não foi dessa vez. '}${item.explanation}`;
  feedback.classList.add('show', isCorrect ? 'good' : 'bad');
  statusText.textContent = isCorrect ? 'Resposta correta!' : 'Resposta registrada.';
  nextButton.disabled = false;
  progressFill.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
}

function showResult() {
  quizContent.hidden = true;
  quizResult.hidden = false;
  const percentage = score * 10;
  let message = 'Continue aprendendo! Conhecer os direitos é um passo importante para fazer escolhas conscientes.';
  let title = 'Você está começando!';
  if (score >= 9) {
    title = 'Excelente conhecimento!';
    message = 'Você demonstrou ótimo domínio dos conceitos apresentados. Continue compartilhando informação de qualidade.';
  } else if (score >= 7) {
    title = 'Muito bem!';
    message = 'Você conhece vários direitos importantes. Revise os temas em que teve dúvidas e continue aprendendo.';
  } else if (score >= 5) {
    title = 'Bom começo!';
    message = 'Você já conhece alguns direitos, e pode ampliar esse conhecimento consultando o Código de Defesa do Consumidor.';
  }
  quizResult.innerHTML = `
    <div class="result-medal">★</div>
    <span class="section-kicker">SEU RESULTADO</span>
    <h3>${title}</h3>
    <div class="score-number">${score}/${questions.length}</div>
    <p>${percentage}% de aproveitamento</p>
    <p>${message}</p>
    <div class="result-actions">
      <button class="btn btn-red" id="restartQuiz">Refazer o quiz ↻</button>
      <a class="btn btn-dark" href="#direitos">Revisar os direitos</a>
    </div>`;
  document.getElementById('restartQuiz').addEventListener('click', restartQuiz);
}

function restartQuiz() {
  currentQuestion = 0;
  score = 0;
  quizContent.hidden = false;
  quizResult.hidden = true;
  renderQuestion();
}

nextButton.addEventListener('click', () => {
  if (!answered) return;
  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    renderQuestion();
  } else {
    showResult();
  }
});

renderQuestion();
