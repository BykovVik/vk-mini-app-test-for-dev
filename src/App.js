import React, { useState } from 'react';
import bridge from '@vkontakte/vk-bridge';
import questions_box from './data/qestions.json'

import {
  View,
  AdaptivityProvider,
  AppRoot,
  Panel,
  Link
} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import './App.css'

const results = {
  frontend: {
    description: "Результаты вашего теста показали, что направление фронтенд разработки является идеальным для вас. Вы обладаете страстью к работе с пользовательским интерфейсом, что подразумевает создание интуитивно понятных, визуально привлекательных и функциональных веб-приложений. Ваше внимание к деталям и эстетическому оформлению помогает создавать интерфейсы, которые не только радуют глаз, но и обеспечивают превосходное пользовательское взаимодействие. Вы стремитесь к тому, чтобы каждое взаимодействие пользователя с веб-приложением было приятным и эффективным, что делает вас ценным специалистом в области фронтенд разработки."
  },
  backend: {
    description: "Результаты вашего теста показали, что направление бэкенд разработки идеально подходит для вас. Вы предпочитаете работать с базами данных и серверной логикой, что подразумевает создание надежных и эффективных серверных систем. Ваши навыки и интересы направлены на обеспечение стабильной работы приложений, включая управление данными, обработку запросов и реализацию бизнес-логики. Вы уделяете внимание деталям и надежности, что помогает вам разрабатывать архитектуры, способные выдерживать высокие нагрузки и обеспечивать безопасность данных. Ваше стремление к созданию устойчивых и производительных серверных решений делает вас ключевым специалистом в области бэкенд разработки."
  },
  gamedev: {
    description: "Результаты вашего теста показали, что направление геймдева идеально подходит для вас. Вы увлечены созданием игр и игровых механик, что предполагает разработку захватывающих игровых проектов, которые привлекают внимание игроков и удерживают их интерес. Вы предпочитаете работать над компьютерными и мобильными играми, используя игровые движки и инструменты для создания игр, такие как Unity и C#. Ваши творческие способности и технические навыки позволяют вам разрабатывать уникальные игровые миры и механики, обеспечивая погружающий и увлекательный игровой опыт. Вы наслаждаетесь работой в команде над игровыми проектами, где каждая деталь имеет значение и каждая идея может быть воплощена в жизнь. Ваше стремление к изучению новых игровых движков и инструментов показывает, что вы готовы к постоянному совершенствованию и инновациям. Ваши усилия направлены на создание увлекательных игровых миров, что делает вас ценным специалистом в области геймдева."
  },
  mobile: {
    description: "Результаты вашего теста показали, что разработка мобильных приложений идеально подходит для вас. Вы увлечены работой с разнообразными устройствами и стремитесь создавать приложения для мобильных платформ, которые отличаются высоким качеством и удобством использования. Ваши интересы и навыки направлены на разработку мобильных решений, которые работают плавно и эффективно на различных операционных системах и устройствах. Вы уделяете внимание как техническим аспектам, таким как оптимизация производительности и управление ресурсами, так и пользовательскому опыту, создавая интуитивно понятные и привлекательные интерфейсы. Ваше стремление к инновациям и качеству в мобильной разработке делает вас ценным специалистом в этой быстро развивающейся области."
  }
};

export const App = () => {
  const [activePanel, setActivePanel] = useState('home');
  const [selectedAnswers, setSelectedAnswers] = useState([]);

  const questions = questions_box.questions

  const showAdd = (panel) => {
        
    bridge.send('VKWebAppShowNativeAds', { ad_format: 'interstitial' })
      .then((data) => {
          if (data.result) {
              console.log('Advertisement shown');
              setActivePanel(panel);
          } else {
              console.log('Error while displaying');
              setActivePanel(panel);
          }
      })
      .catch((error) => { 
          console.log(error);
          setActivePanel(panel);
      });
  }

  const startTest = () => {
    setSelectedAnswers([]);
    showAdd('question_0')
  };

  const handleAnswer = (index, answer) => {
    const newAnswers = [...selectedAnswers, answer];
    setSelectedAnswers(newAnswers);

    if (index < questions.length - 1) {
      setActivePanel(`question_${index + 1}`);
    } else {
      setActivePanel('result');
    }
  };

  const calculateResult = () => {
    // Простая логика подсчета результатов
    const count = { frontend: 0, backend: 0, mobile: 0, gamedev: 0 };

    selectedAnswers.forEach(answer => {
      switch (answer) {
        case 0: count.frontend++; break;
        case 1: count.backend++; break;
        case 2: count.mobile++; break;
        case 3: count.gamedev++; break;
        default: break;
      }
    });

    const result = Object.keys(count).reduce((a, b) => count[a] > count[b] ? a : b);
    return results[result];
  };

  const shareResult = () => {
    bridge.send("VKWebAppShowWallPostBox", {
      message: calculateResult().description,
      attachments: 'https://vk.com/app51931140',
    })
    .then((data) => {
        console.log("WALL POSTING DATA", data)
        showAdd('result')
    })
    .catch( (error) => {
        if (error.error_data.error_reason === 'Access to adding post denied') {
            AllowNotifications()
        }
        console.error("WALL POSTING ERROR", error)
    });
  };

  return (
    <AdaptivityProvider>
        <AppRoot>
            <View activePanel={activePanel}>
                <Panel id="home">
                    <div className='panel_in_wrap'>
                        <div>
                            <h3 className='title_text'>{questions_box.description}</h3>
                            <button className='yellow_button' onClick={startTest}>Начать тест</button>
                            <button className='yellow_button' onClick={() => setActivePanel('description')}>Описание</button>
                        </div>
                    </div>
                </Panel>

                <Panel id="description">
                    <div className='panel_in_wrap'>
                        <div>
                            <p className='page_text'>Этот тест поможет вам определить, какое направление в разработке вам подходит больше всего. Ответьте на 10 простых вопросов, чтобы узнать, стоит ли вам заниматься фронтендом, бэкендом, мобильной разработкой или разработкой игр. Тест рассчитан на новичков и не требует глубоких знаний в программировании. Узнайте, в каком направлении вы сможете максимально раскрыть свой потенциал!</p>
                            <button className='yellow_button' onClick={() => setActivePanel('home')}>На главную</button>
                        </div>
                    </div>
                </Panel>

                {questions.map((q, index) => (
                    <Panel id={`question_${index}`} key={index} className='questions'>
                        <div>
                            <div>
                                <div className='question_text'>
                                    <h3>{q.question}</h3>
                                    <p>Вопрос {index + 1}</p>
                                </div>
                                {q.options.map((option, i) => (
                                    <div className='link_box'>
                                        <a key={i} className='link_text' onClick={() => handleAnswer(index, i)}>
                                            {option}
                                        </a>
                                    </div>
                                ))}
                                <p></p>
                                <p></p>
                                <button className='yellow_button' onClick={() => setActivePanel('home')}>На главную</button>
                            </div>
                        </div>
                    </Panel>
                ))}

                <Panel id="result">
                    <div>
                        <div>
                            <div className='question_text'>
                                <p>Результат</p>
                            </div>
                            <div>
                                <p className='page_text'>{calculateResult().description}</p>
                                <p></p>
                                <p className='page_text'>Также рекомендую вам несколько групп, где я описываю разработку веб-приложений и инди-игр:</p>
                            </div>
                            
                            <Link className='link_button' target="_blank" href='https://vk.com/this_is_for_geeks'>
                                Для программистов
                            </Link>
                           
                            <Link className='link_button' target="_blank" href='https://vk.com/this_is_for_indie_developers'>
                                Для разработчиков игр
                            </Link>
                            
                            <button className='yellow_button' onClick={() => setActivePanel('home')}>
                                Начать заново
                            </button>
                            
                            <button className='red_button' onClick={shareResult}>
                                Поделиться результатом
                            </button>
                        </div>
                    </div>
                    
                </Panel>
            </View>
        </AppRoot>
    </AdaptivityProvider>
  );
};