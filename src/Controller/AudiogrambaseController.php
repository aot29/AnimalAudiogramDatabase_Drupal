<?php
/**
 * @file
 * Contains \Drupal\audiogrambase\Controller\AudiogrambaseController.
 */
namespace Drupal\audiogrambase\Controller;
use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\DependencyInjection\ContainerInterface;

class AudiogrambaseController extends ControllerBase {
    protected $twig;
    const allowed_tags = [
        'script', 'div', 'table', 'tr', 'td', 'th', 'i', 'link',
        'h1', 'h2', 'h3', 'a', 'img', 'details', 'summary', 'ul', 'li',
        'input', 'select', 'option', 'div', 'span', 'br'
    ];
    #const API_URL = 'http://hip-data-exchange.test.code.naturkundemuseum.berlin/api/v1/';
    #const BASE_URL = 'http://hip-data-exchange.test.code.naturkundemuseum.berlin';
    const API_URL = 'http://localhost:9082/api/v1/';
    const BASE_URL = 'http://localhost:9082';
    
    // this is called first then call constructor 
    public static function create(ContainerInterface $container) {
        return new static(
            $container->get('twig') ,
        );
    }

    public function __construct(\Twig_Environment $twig) {
        $this->twig = $twig ;
    }

    public function browse() {
        $browse_tpl = drupal_get_path('module', 'audiogrambase') . '/templates/browse-template.html.twig';
        $template = $this->twig->loadTemplate($browse_tpl);
        $markup = [
            '#markup' => $template->render([
                'API_URL' => self::API_URL,
                'BASE_URL' => self::BASE_URL,
            ]),
            '#allowed_tags' => self::allowed_tags
        ];
        return $markup;
    }
    
    public function details() {
        $details_tpl = drupal_get_path('module', 'audiogrambase') . '/templates/details-template.html.twig';
        $template = $this->twig->loadTemplate($details_tpl);
        $markup = [
            '#markup' => $template->render([
                'API_URL' => self::API_URL,
                'BASE_URL' => self::BASE_URL,
            ]),
            '#allowed_tags' => self::allowed_tags
        ];
        return $markup;
    }
    
    public function advanced() {
        $browse_tpl = drupal_get_path('module', 'audiogrambase') . '/templates/advanced-template.html.twig';
        $template = $this->twig->loadTemplate($browse_tpl);
        $markup = [
            '#markup' => $template->render([
                'API_URL' => self::API_URL,
                'BASE_URL' => self::BASE_URL,
            ]),
            '#allowed_tags' => self::allowed_tags
        ];
        return $markup;
    }
}
